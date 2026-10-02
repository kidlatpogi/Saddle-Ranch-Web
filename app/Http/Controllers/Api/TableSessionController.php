<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\TableSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TableSessionController extends Controller
{
    /**
     * Standard list of table identifiers.
     */
    protected array $defaultTables = [
        '01', '02', '03', '04', '05', '06', '07', '08',
        '09', '10', '11', '12', '13', '14', '15', '16',
        '17', '18', '19', '20', '21', '22', '23', '24', '25'
    ];

    /**
     * Resolve and validate authorized branch for cashier/staff operations.
     * Cashiers are strictly restricted to their assigned branch.
     */
    protected function resolveAuthorizedBranch(?string $requestedBranch): array
    {
        $user = auth()->user() ?? auth('sanctum')->user();

        // Non-admin cashiers / employees must be restricted to their assigned branch
        if ($user && $user->role !== 'admin') {
            $userBranch = ($user->branch && str_contains(strtolower($user->branch), 'dasma')) ? 'Dasma' : 'Bulihan';

            if ($requestedBranch && str_contains(strtolower($requestedBranch), 'dasma') !== str_contains(strtolower($user->branch), 'dasma')) {
                $target = str_contains(strtolower($requestedBranch), 'dasma') ? 'Dasma' : 'Bulihan';
                return [
                    'authorized' => false,
                    'branch' => $userBranch,
                    'error' => "Unauthorized: You are assigned to the {$userBranch} branch and cannot manage tables for the {$target} branch.",
                ];
            }

            return ['authorized' => true, 'branch' => $userBranch, 'error' => null];
        }

        // Admins or unauthenticated public readers (normalized strictly to Bulihan or Dasma, never 'all')
        $target = ($requestedBranch && str_contains(strtolower($requestedBranch), 'dasma')) ? 'Dasma' : 'Bulihan';
        return ['authorized' => true, 'branch' => $target, 'error' => null];
    }

    /**
     * Ensure branch has at least the baseline standard tables initialized in DB.
     */
    protected function ensureBranchTablesSeeded(string $branchKey): void
    {
        $count = TableSession::where(function ($q) use ($branchKey) {
            $q->where('branch', $branchKey)
              ->orWhere('branch', 'LIKE', "%{$branchKey}%");
        })->count();

        if ($count === 0) {
            for ($i = 1; $i <= 25; $i++) {
                $num = str_pad($i, 2, '0', STR_PAD_LEFT);
                TableSession::firstOrCreate(
                    [
                        'table_number' => $num,
                        'branch' => $branchKey,
                    ],
                    [
                        'status' => 'closed',
                        'duration_minutes' => 60,
                    ]
                );
            }
        }
    }

    /**
     * List all table sessions for staff / cashier / admin view.
     */
    public function index(Request $request): JsonResponse
    {
        $authBranch = $this->resolveAuthorizedBranch($request->query('branch'));
        if (!$authBranch['authorized']) {
            return response()->json([
                'status' => 'error',
                'message' => $authBranch['error'],
            ], 403);
        }
        $branchKey = $authBranch['branch'];

        $this->ensureBranchTablesSeeded($branchKey);

        $dbSessions = TableSession::where(function ($q) use ($branchKey) {
            $q->where('branch', $branchKey)
              ->orWhere('branch', 'LIKE', "%{$branchKey}%");
        })->get();

        // Consolidate any duplicate records (e.g. legacy 'B-01' vs '01') by normalized table number
        $grouped = [];
        foreach ($dbSessions as $session) {
            $norm = TableSession::normalizeTableNumber($session->table_number);
            if (!isset($grouped[$norm])) {
                $grouped[$norm] = $session;
            } else {
                // If one row is active and the other closed, prioritize the active session!
                if ($session->isActive() && !$grouped[$norm]->isActive()) {
                    $grouped[$norm] = $session;
                }
            }
        }

        // Sort naturally by table number (01, 02, ... 25, 26, ...)
        uksort($grouped, function ($a, $b) {
            if (is_numeric($a) && is_numeric($b)) {
                return (int)$a <=> (int)$b;
            }
            return strnatcasecmp($a, $b);
        });

        $result = [];
        $activeCount = 0;
        $closedCount = 0;

        foreach ($grouped as $norm => $session) {
            $sessionData = $session->toSessionArray();
            $sessionData['table_number'] = $norm;

            if ($sessionData['status'] === 'active') {
                $activeCount++;
            } else {
                $closedCount++;
            }

            $result[] = $sessionData;
        }

        return response()->json([
            'status' => 'success',
            'data' => $result,
            'tables' => $result,
            'branch' => $branchKey,
            'active_count' => $activeCount,
            'closed_count' => $closedCount,
        ]);
    }

    /**
     * Get real-time session status for a single table (Polled by customer /dine-in).
     */
    public function show(Request $request, string $tableNumber): JsonResponse
    {
        $branch = $request->query('branch', 'Bulihan');
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';
        $variants = TableSession::lookupVariants($tableNumber, $branchKey);
        $norm = TableSession::normalizeTableNumber($tableNumber);

        $session = TableSession::whereIn('table_number', $variants)
            ->where(function ($q) use ($branchKey) {
                $q->where('branch', $branchKey)
                  ->orWhere('branch', 'LIKE', "%{$branchKey}%");
            })
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->first();

        if (!$session) {
            $prefix = $branchKey === 'Dasma' ? 'D-' : 'B-';
            $displayCode = is_numeric($norm) ? ($prefix . $norm) : $tableNumber;

            return response()->json([
                'status' => 'success',
                'data' => [
                    'table_number' => $norm,
                    'display_code' => $displayCode,
                    'branch' => $branchKey,
                    'status' => 'closed',
                    'remaining_seconds' => 0,
                    'formatted_remaining' => 'Closed',
                    'expires_at' => null,
                    'is_active' => false,
                ],
            ]);
        }

        $sessionArray = $session->toSessionArray();
        return response()->json([
            'status' => 'success',
            'data' => $sessionArray,
        ]);
    }

    /**
     * Open a table session with duration.
     */
    public function open(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'required|string',
            'branch' => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:5|max:360',
        ]);

        $authBranch = $this->resolveAuthorizedBranch($validated['branch'] ?? null);
        if (!$authBranch['authorized']) {
            return response()->json([
                'status' => 'error',
                'message' => $authBranch['error'],
            ], 403);
        }
        $branchKey = $authBranch['branch'];

        $norm = TableSession::normalizeTableNumber($validated['table_number']);
        $variants = TableSession::lookupVariants($validated['table_number'], $branchKey);
        $duration = (int) ($validated['duration_minutes'] ?? 60);

        $now = now();
        $expiresAt = (clone $now)->addMinutes($duration);

        // Update or create normalized table session
        $session = TableSession::updateOrCreate(
            [
                'table_number' => $norm,
                'branch' => $branchKey,
            ],
            [
                'status' => 'active',
                'opened_at' => $now,
                'expires_at' => $expiresAt,
                'duration_minutes' => $duration,
                'opened_by_user_id' => auth()->id(),
            ]
        );

        // Synchronize any legacy variant rows in the DB so they are in sync
        TableSession::where('branch', $branchKey)
            ->whereIn('table_number', $variants)
            ->where('id', '!=', $session->id)
            ->update([
                'status' => 'active',
                'opened_at' => $now,
                'expires_at' => $expiresAt,
                'duration_minutes' => $duration,
                'opened_by_user_id' => auth()->id(),
            ]);

        $staffName = auth()->user()?->name ?? 'Staff';
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "TABLE SESSION OPENED: Table #{$norm} activated for {$duration} mins at {$branchKey} Branch by {$staffName}",
            'ip_address' => $request->ip(),
            'payload' => [
                'table_number' => $norm,
                'branch' => $branchKey,
                'duration_minutes' => $duration,
                'expires_at' => $expiresAt->toIso8601String(),
            ],
        ]);

        // Automatically resolve any pending table unlock requests for this table & branch
        $unlockReqs = \Illuminate\Support\Facades\Cache::get('active_table_unlock_requests', []);
        $filteredReqs = array_values(array_filter($unlockReqs, function ($r) use ($variants, $branchKey) {
            $rNum = $r['table_number'] ?? '';
            $rBranch = $r['branch'] ?? 'Bulihan';
            $matchBranch = str_contains(strtolower($rBranch), 'dasma') ? 'Dasma' : 'Bulihan';
            return !(in_array($rNum, $variants, true) && $matchBranch === $branchKey);
        }));
        \Illuminate\Support\Facades\Cache::put('active_table_unlock_requests', $filteredReqs, 1800);

        foreach ($variants as $v) {
            \Illuminate\Support\Facades\Cache::put("table_unlock_status_{$v}", ['status' => 'unlocked', 'updated_at' => time()], 300);
            \Illuminate\Support\Facades\Cache::put("table_unlock_status_{$branchKey}_{$v}", ['status' => 'unlocked', 'updated_at' => time()], 300);
        }

        return response()->json([
            'status' => 'success',
            'message' => "Table #{$norm} dining session opened ({$duration} mins).",
            'data' => $session->toSessionArray(),
        ]);
    }

    /**
     * Close a table session immediately.
     */
    public function close(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'required|string',
            'branch' => 'nullable|string',
        ]);

        $authBranch = $this->resolveAuthorizedBranch($validated['branch'] ?? null);
        if (!$authBranch['authorized']) {
            return response()->json([
                'status' => 'error',
                'message' => $authBranch['error'],
            ], 403);
        }
        $branchKey = $authBranch['branch'];

        $norm = TableSession::normalizeTableNumber($validated['table_number']);
        $variants = TableSession::lookupVariants($validated['table_number'], $branchKey);

        $session = TableSession::updateOrCreate(
            [
                'table_number' => $norm,
                'branch' => $branchKey,
            ],
            [
                'status' => 'closed',
                'expires_at' => now(),
            ]
        );

        // Close ALL matching variants in the DB (fixes "B-01 is not closing" bug)
        TableSession::where('branch', $branchKey)
            ->whereIn('table_number', $variants)
            ->where('id', '!=', $session->id)
            ->update([
                'status' => 'closed',
                'expires_at' => now(),
            ]);

        $staffName = auth()->user()?->name ?? 'Staff';
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "TABLE SESSION CLOSED: Table #{$norm} session closed at {$branchKey} Branch by {$staffName}",
            'ip_address' => $request->ip(),
            'payload' => [
                'table_number' => $norm,
                'branch' => $branchKey,
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Table #{$norm} session closed.",
            'data' => $session->toSessionArray(),
        ]);
    }

    /**
     * Extend an active table session (e.g. +15 or +30 mins).
     */
    public function extend(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_number' => 'required|string',
            'branch' => 'nullable|string',
            'minutes' => 'nullable|integer|min:5|max:180',
        ]);

        $authBranch = $this->resolveAuthorizedBranch($validated['branch'] ?? null);
        if (!$authBranch['authorized']) {
            return response()->json([
                'status' => 'error',
                'message' => $authBranch['error'],
            ], 403);
        }
        $branchKey = $authBranch['branch'];

        $norm = TableSession::normalizeTableNumber($validated['table_number']);
        $variants = TableSession::lookupVariants($validated['table_number'], $branchKey);
        $minutes = (int) ($validated['minutes'] ?? 15);

        $session = TableSession::firstOrNew([
            'table_number' => $norm,
            'branch' => $branchKey,
        ]);

        $baseTime = ($session->expires_at && $session->expires_at->isFuture())
            ? $session->expires_at
            : now();

        $session->status = 'active';
        $session->opened_at = $session->opened_at ?: now();
        $session->expires_at = (clone $baseTime)->addMinutes($minutes);
        $session->duration_minutes = (int) $session->duration_minutes + $minutes;
        $session->save();

        // Also synchronize any legacy variant rows
        TableSession::where('branch', $branchKey)
            ->whereIn('table_number', $variants)
            ->where('id', '!=', $session->id)
            ->update([
                'status' => 'active',
                'opened_at' => $session->opened_at,
                'expires_at' => $session->expires_at,
                'duration_minutes' => $session->duration_minutes,
            ]);

        $staffName = auth()->user()?->name ?? 'Staff';
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "TABLE SESSION EXTENDED: Table #{$norm} extended by +{$minutes} mins at {$branchKey} Branch by {$staffName}",
            'ip_address' => $request->ip(),
            'payload' => [
                'table_number' => $norm,
                'branch' => $branchKey,
                'added_minutes' => $minutes,
                'new_expires_at' => $session->expires_at->toIso8601String(),
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Table #{$norm} session extended by +{$minutes} minutes.",
            'data' => $session->toSessionArray(),
        ]);
    }

    /**
     * Batch open/close all tables for the branch.
     */
    public function batch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:open_all,close_all',
            'branch' => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:5|max:360',
        ]);

        $authBranch = $this->resolveAuthorizedBranch($validated['branch'] ?? null);
        if (!$authBranch['authorized']) {
            return response()->json([
                'status' => 'error',
                'message' => $authBranch['error'],
            ], 403);
        }
        $branchKey = $authBranch['branch'];

        $this->ensureBranchTablesSeeded($branchKey);

        $action = $validated['action'];
        $duration = (int) ($validated['duration_minutes'] ?? 60);

        $now = now();
        $expiresAt = (clone $now)->addMinutes($duration);

        // Fetch ALL tables for this branch from DB
        $tables = TableSession::where(function ($q) use ($branchKey) {
            $q->where('branch', $branchKey)
              ->orWhere('branch', 'LIKE', "%{$branchKey}%");
        })->get();

        foreach ($tables as $table) {
            if ($action === 'open_all') {
                $table->status = 'active';
                $table->opened_at = $now;
                $table->expires_at = $expiresAt;
                $table->duration_minutes = $duration;
                $table->opened_by_user_id = auth()->id();
            } else {
                $table->status = 'closed';
                $table->expires_at = $now;
            }
            $table->save();
        }

        // If batch open or close, clear active unlock requests
        \Illuminate\Support\Facades\Cache::forget('active_table_unlock_requests');

        $staffName = auth()->user()?->name ?? 'Staff';
        $actionDesc = ($action === 'open_all')
            ? "ALL TABLES OPENED for {$duration} mins at {$branchKey} Branch by {$staffName}"
            : "ALL TABLES CLOSED at {$branchKey} Branch by {$staffName}";

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "BATCH TABLE ACTION: {$actionDesc}",
            'ip_address' => $request->ip(),
            'payload' => ['action' => $action, 'branch' => $branchKey, 'tables_affected' => $tables->count()],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => ($action === 'open_all') ? "All tables successfully opened for {$duration} minutes." : "All tables have been closed.",
        ]);
    }

    /**
     * Add a new table QR / session to a branch (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user() ?? auth('sanctum')->user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized: Only administrators can add tables.'], 403);
        }

        $validated = $request->validate([
            'branch' => 'nullable|string',
            'table_number' => 'nullable|string',
        ]);

        $authBranch = $this->resolveAuthorizedBranch($validated['branch'] ?? null);
        $branchKey = $authBranch['branch'];

        $this->ensureBranchTablesSeeded($branchKey);

        if (!empty($validated['table_number'])) {
            $norm = TableSession::normalizeTableNumber($validated['table_number']);
        } else {
            // Auto-detect next table number
            $existingNums = TableSession::where(function ($q) use ($branchKey) {
                $q->where('branch', $branchKey)
                  ->orWhere('branch', 'LIKE', "%{$branchKey}%");
            })
            ->pluck('table_number')
            ->map(fn($n) => (int) TableSession::normalizeTableNumber($n))
            ->filter(fn($n) => $n > 0)
            ->all();

            $maxNum = !empty($existingNums) ? max($existingNums) : 25;
            $next = $maxNum + 1;
            $norm = str_pad($next, 2, '0', STR_PAD_LEFT);
        }

        $session = TableSession::firstOrCreate(
            [
                'table_number' => $norm,
                'branch' => $branchKey,
            ],
            [
                'status' => 'closed',
                'duration_minutes' => 60,
            ]
        );

        $adminName = $user?->name ?? 'Admin';
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "NEW TABLE ADDED: Table #{$norm} generated for {$branchKey} Branch by {$adminName}",
            'ip_address' => $request->ip(),
            'payload' => ['table_number' => $norm, 'branch' => $branchKey],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Table #{$norm} successfully added to {$branchKey} Branch.",
            'data' => $session->toSessionArray(),
        ]);
    }

    /**
     * Delete a table QR / session from a branch (Admin only).
     */
    public function destroy(Request $request, string $tableNumber): JsonResponse
    {
        $user = auth()->user() ?? auth('sanctum')->user();
        if ($user && $user->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized: Only administrators can delete tables.'], 403);
        }

        $branch = $request->query('branch') ?? $request->input('branch');
        $authBranch = $this->resolveAuthorizedBranch($branch);
        $branchKey = $authBranch['branch'];

        $norm = TableSession::normalizeTableNumber($tableNumber);
        $variants = TableSession::lookupVariants($tableNumber, $branchKey);

        TableSession::where(function ($q) use ($branchKey) {
            $q->where('branch', $branchKey)
              ->orWhere('branch', 'LIKE', "%{$branchKey}%");
        })
        ->whereIn('table_number', $variants)
        ->delete();

        $adminName = $user?->name ?? 'Admin';
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "TABLE DELETED: Table #{$norm} removed from {$branchKey} Branch by {$adminName}",
            'ip_address' => $request->ip(),
            'payload' => ['table_number' => $norm, 'branch' => $branchKey],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Table #{$norm} successfully removed from {$branchKey} Branch.",
        ]);
    }
}

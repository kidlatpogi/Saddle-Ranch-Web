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
     * List all table sessions for staff / cashier / admin view.
     */
    public function index(Request $request): JsonResponse
    {
        $branch = $request->query('branch', 'Bulihan');
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';

        $dbSessions = TableSession::where(function ($q) use ($branchKey) {
            $q->where('branch', $branchKey)
              ->orWhere('branch', 'LIKE', "%{$branchKey}%");
        })->get()->keyBy('table_number');

        $result = [];
        $activeCount = 0;
        $closedCount = 0;

        foreach ($this->defaultTables as $num) {
            $session = $dbSessions->get($num);
            if ($session) {
                $sessionData = $session->toSessionArray();
            } else {
                $sessionData = [
                    'id' => null,
                    'table_number' => $num,
                    'branch' => $branchKey,
                    'status' => 'closed',
                    'opened_at' => null,
                    'expires_at' => null,
                    'duration_minutes' => 60,
                    'remaining_seconds' => 0,
                    'formatted_remaining' => 'Closed',
                    'opened_by' => null,
                ];
            }

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
        $norm = TableSession::normalizeTableNumber($tableNumber);
        $branch = $request->query('branch', 'Bulihan');
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';

        $session = TableSession::where(function ($q) use ($norm, $tableNumber) {
            $q->where('table_number', $norm)
              ->orWhere('table_number', $tableNumber);
        })
        ->where(function ($q) use ($branchKey) {
            $q->where('branch', $branchKey)
              ->orWhere('branch', 'LIKE', "%{$branchKey}%")
              ->orWhere('branch', 'all');
        })
        ->first();

        if (!$session) {
            return response()->json([
                'status' => 'success',
                'data' => [
                    'table_number' => $norm,
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
        $sessionArray['is_active'] = ($sessionArray['status'] === 'active');

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

        $norm = TableSession::normalizeTableNumber($validated['table_number']);
        $branch = $validated['branch'] ?? 'Bulihan';
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';
        $duration = (int) ($validated['duration_minutes'] ?? 60);

        $now = now();
        $expiresAt = (clone $now)->addMinutes($duration);

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

        // Automatically resolve any pending table unlock requests for this table
        $unlockReqs = \Illuminate\Support\Facades\Cache::get('active_table_unlock_requests', []);
        $rawNum = $validated['table_number'];
        $filteredReqs = array_values(array_filter($unlockReqs, function ($r) use ($norm, $rawNum) {
            $rNum = $r['table_number'] ?? '';
            return $rNum !== $norm && $rNum !== $rawNum;
        }));
        \Illuminate\Support\Facades\Cache::put('active_table_unlock_requests', $filteredReqs, 1800);
        \Illuminate\Support\Facades\Cache::put("table_unlock_status_{$norm}", ['status' => 'unlocked', 'updated_at' => time()], 300);
        \Illuminate\Support\Facades\Cache::put("table_unlock_status_{$rawNum}", ['status' => 'unlocked', 'updated_at' => time()], 300);

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

        $norm = TableSession::normalizeTableNumber($validated['table_number']);
        $branch = $validated['branch'] ?? 'Bulihan';
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';

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

        $norm = TableSession::normalizeTableNumber($validated['table_number']);
        $branch = $validated['branch'] ?? 'Bulihan';
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';
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
     * Batch open/close all tables (great for demonstration & mass seating).
     */
    public function batch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|in:open_all,close_all',
            'branch' => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:5|max:360',
        ]);

        $action = $validated['action'];
        $branch = $validated['branch'] ?? 'Bulihan';
        $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';
        $duration = (int) ($validated['duration_minutes'] ?? 60);

        $now = now();
        $expiresAt = (clone $now)->addMinutes($duration);

        foreach ($this->defaultTables as $num) {
            TableSession::updateOrCreate(
                [
                    'table_number' => $num,
                    'branch' => $branchKey,
                ],
                $action === 'open_all' ? [
                    'status' => 'active',
                    'opened_at' => $now,
                    'expires_at' => $expiresAt,
                    'duration_minutes' => $duration,
                    'opened_by_user_id' => auth()->id(),
                ] : [
                    'status' => 'closed',
                    'expires_at' => $now,
                ]
            );
        }

        $staffName = auth()->user()?->name ?? 'Staff';
        $actionDesc = ($action === 'open_all')
            ? "ALL TABLES OPENED for {$duration} mins at {$branchKey} Branch by {$staffName}"
            : "ALL TABLES CLOSED at {$branchKey} Branch by {$staffName}";

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "BATCH TABLE ACTION: {$actionDesc}",
            'ip_address' => $request->ip(),
            'payload' => ['action' => $action, 'branch' => $branchKey],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => ($action === 'open_all') ? "All tables successfully opened for {$duration} minutes." : "All tables have been closed.",
        ]);
    }
}

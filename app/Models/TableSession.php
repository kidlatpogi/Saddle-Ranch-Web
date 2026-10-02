<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TableSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'branch',
        'status',
        'opened_at',
        'expires_at',
        'duration_minutes',
        'opened_by_user_id',
        'notes',
    ];

    protected $casts = [
        'opened_at' => 'datetime',
        'expires_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    public function openedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'opened_by_user_id');
    }

    /**
     * Determine if session is currently active and within time limit.
     */
    public function getEffectiveStatusAttribute(): string
    {
        if ($this->status === 'closed') {
            return 'closed';
        }

        if ($this->status === 'active') {
            if ($this->expires_at && $this->expires_at->isPast()) {
                return 'expired';
            }
            return 'active';
        }

        return $this->status ?: 'closed';
    }

    public function isActive(): bool
    {
        return $this->effective_status === 'active';
    }

    public function getRemainingSecondsAttribute(): int
    {
        if ($this->effective_status !== 'active' || !$this->expires_at) {
            return 0;
        }

        return max(0, now()->diffInSeconds($this->expires_at, false));
    }

    public function getFormattedRemainingAttribute(): string
    {
        $sec = $this->remaining_seconds;
        if ($sec <= 0) {
            return $this->effective_status === 'expired' ? 'Session Expired' : 'Closed';
        }

        $mins = floor($sec / 60);
        $secs = $sec % 60;
        return sprintf('%02d:%02d', $mins, $secs);
    }

    /**
     * Normalize table number (e.g., "05", "B-05", "D-05", "5" -> "05")
     * Strips branch prefixes and zero-pads digits to 2 places.
     * Preserves custom alphanumeric table names (e.g., "EXPRESS", "VIP1").
     */
    public static function normalizeTableNumber(string $tableNumber): string
    {
        $cleaned = trim($tableNumber);
        if (preg_match('/^[BD]-?(\d+)$/i', $cleaned, $matches)) {
            return str_pad($matches[1], 2, '0', STR_PAD_LEFT);
        }
        if (is_numeric($cleaned)) {
            return str_pad($cleaned, 2, '0', STR_PAD_LEFT);
        }
        return strtoupper($cleaned);
    }

    /**
     * Get all possible string representations of a table number for a branch.
     * e.g., for "05" at Bulihan: ["05", "5", "B-05", "B-5", "B05"]
     */
    public static function lookupVariants(string $tableNumber, ?string $branch = null): array
    {
        $norm = self::normalizeTableNumber($tableNumber);
        $raw = trim($tableNumber);
        $variants = [$norm, $raw, strtoupper($raw)];

        if (is_numeric($norm)) {
            $unpadded = (string) (int) $norm;
            $variants[] = $unpadded;
            $variants[] = "B-{$norm}";
            $variants[] = "B-{$unpadded}";
            $variants[] = "B{$norm}";
            $variants[] = "D-{$norm}";
            $variants[] = "D-{$unpadded}";
            $variants[] = "D{$norm}";
        }

        return array_values(array_unique($variants));
    }

    /**
     * Check if a specific table number is currently active for ordering.
     */
    public static function isTableActive(string $tableNumber, ?string $branch = null): bool
    {
        $raw = strtoupper(trim($tableNumber));
        if (!empty($branch)) {
            $branchKey = str_contains(strtolower($branch), 'dasma') ? 'Dasma' : 'Bulihan';
        } elseif (str_starts_with($raw, 'D-')) {
            $branchKey = 'Dasma';
        } else {
            $branchKey = 'Bulihan';
        }

        $variants = self::lookupVariants($tableNumber, $branchKey);

        $sessions = self::whereIn('table_number', $variants)
            ->where(function ($q) use ($branchKey) {
                $q->where('branch', $branchKey)
                  ->orWhere('branch', 'LIKE', "%{$branchKey}%");
            })
            ->get();

        foreach ($sessions as $session) {
            if ($session->isActive()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Helper to export clean JSON array for frontend
     */
    public function toSessionArray(): array
    {
        $effStatus = $this->effective_status;
        $norm = self::normalizeTableNumber($this->table_number);
        $prefix = (str_contains(strtolower($this->branch ?? ''), 'dasma')) ? 'D-' : 'B-';
        $displayCode = is_numeric($norm) ? ($prefix . $norm) : $this->table_number;

        return [
            'id' => $this->id,
            'table_number' => $norm,
            'display_code' => $displayCode,
            'branch' => $this->branch,
            'status' => $effStatus,
            'is_active' => ($effStatus === 'active'),
            'opened_at' => $this->opened_at ? $this->opened_at->toIso8601String() : null,
            'expires_at' => $this->expires_at ? $this->expires_at->toIso8601String() : null,
            'duration_minutes' => $this->duration_minutes,
            'remaining_seconds' => $this->remaining_seconds,
            'formatted_remaining' => $this->formatted_remaining,
            'opened_by' => $this->openedBy?->name ?? 'Staff',
        ];
    }
}

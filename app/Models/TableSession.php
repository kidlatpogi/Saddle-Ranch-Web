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
     * Normalize table number (e.g., "05", "B-05", "5" -> normalized string)
     */
    public static function normalizeTableNumber(string $tableNumber): string
    {
        $cleaned = trim($tableNumber);
        // If it starts with B- or D-, keep as is, or extract digits
        if (preg_match('/^[BD]-(\d+)$/i', $cleaned, $matches)) {
            return strtoupper(substr($cleaned, 0, 2)) . str_pad($matches[1], 2, '0', STR_PAD_LEFT);
        }
        if (is_numeric($cleaned)) {
            return str_pad($cleaned, 2, '0', STR_PAD_LEFT);
        }
        return strtoupper($cleaned);
    }

    /**
     * Check if a specific table number is currently active for ordering.
     */
    public static function isTableActive(string $tableNumber, ?string $branch = null): bool
    {
        $norm = self::normalizeTableNumber($tableNumber);
        $query = self::where(function ($q) use ($norm, $tableNumber) {
            $q->where('table_number', $norm)
              ->orWhere('table_number', $tableNumber);
        });

        if ($branch && strtolower($branch) !== 'all') {
            $query->where(function ($q) use ($branch) {
                $q->where('branch', 'LIKE', "%{$branch}%")
                  ->orWhere('branch', 'all');
            });
        }

        $session = $query->first();

        if (!$session) {
            return false;
        }

        return $session->isActive();
    }

    /**
     * Helper to export clean JSON array for frontend
     */
    public function toSessionArray(): array
    {
        $effStatus = $this->effective_status;

        return [
            'id' => $this->id,
            'table_number' => $this->table_number,
            'branch' => $this->branch,
            'status' => $effStatus,
            'opened_at' => $this->opened_at ? $this->opened_at->toIso8601String() : null,
            'expires_at' => $this->expires_at ? $this->expires_at->toIso8601String() : null,
            'duration_minutes' => $this->duration_minutes,
            'remaining_seconds' => $this->remaining_seconds,
            'formatted_remaining' => $this->formatted_remaining,
            'opened_by' => $this->openedBy?->name ?? 'Staff',
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_type',
        'value',
        'min_spend',
        'is_one_time_use',
        'is_limited_time',
        'branch',
        'starts_at',
        'expires_at',
        'times_used',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'min_spend' => 'decimal:2',
            'is_one_time_use' => 'boolean',
            'is_limited_time' => 'boolean',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'times_used' => 'integer',
        ];
    }
}

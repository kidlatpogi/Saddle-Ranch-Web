<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailOtp extends Model
{
    public const PURPOSE_VERIFY = 'verify';
    public const PURPOSE_RESET = 'reset';

    protected $fillable = [
        'email',
        'code_hash',
        'purpose',
        'attempts',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'attempts' => 'integer',
        ];
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}

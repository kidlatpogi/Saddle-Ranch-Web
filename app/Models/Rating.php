<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'order_number',
        'user_id',
        'customer_name',
        'customer_phone',
        'branch',
        'overall_rating',
        'food_quality_rating',
        'customer_service_rating',
        'delivery_speed_rating',
        'packaging_rating',
        'comment',
        'favorite_dish',
        'is_featured',
        'is_approved',
        'is_flagged',
        'moderation_flag',
    ];

    protected function casts(): array
    {
        return [
            'overall_rating' => 'integer',
            'food_quality_rating' => 'integer',
            'customer_service_rating' => 'integer',
            'delivery_speed_rating' => 'integer',
            'packaging_rating' => 'integer',
            'is_featured' => 'boolean',
            'is_approved' => 'boolean',
            'is_flagged' => 'boolean',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

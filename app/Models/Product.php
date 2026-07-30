<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'price_bulihan',
        'price_dasmarinas',
        'image_path',
        'stock_quantity',
        'stock_bulihan',
        'stock_dasmarinas',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'price_bulihan' => 'decimal:2',
            'price_dasmarinas' => 'decimal:2',
            'stock_quantity' => 'integer',
            'stock_bulihan' => 'integer',
            'stock_dasmarinas' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

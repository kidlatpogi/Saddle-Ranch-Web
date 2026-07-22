<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\PromoBanner;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin & Employee Accounts
        User::create([
            'name' => 'Saddle Ranch Admin',
            'email' => 'admin@saddleranch.ph',
            'password' => Hash::make('admin123'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Cashier Employee',
            'email' => 'cashier@saddleranch.ph',
            'password' => Hash::make('employee123'),
            'role' => 'employee'
        ]);

        // Saddle Ranch Menu Products
        Product::create([
            'name' => 'Sizzling Pork Sisig',
            'description' => 'Crispy pork belly seasoned with local spices, served on a sizzling hot plate with egg.',
            'price' => 180.00,
            'stock_quantity' => 50,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Pork T-Bone Steak',
            'description' => 'Tender T-Bone steak topped with gravy and buttered vegetables.',
            'price' => 280.00,
            'stock_quantity' => 30,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Bulalo',
            'description' => 'Rich beef shank served with simmering gravy on a sizzling hot plate.',
            'price' => 450.00,
            'stock_quantity' => 15,
            'is_active' => true,
        ]);

        // Promo Banner & Voucher
        PromoBanner::create([
            'title' => 'Bulihan Fiesta Special - 10% Off Sizzling Sisig',
            'image_path' => 'banners/fiesta-special.jpg',
            'is_active' => true,
            'display_order' => 1,
        ]);

        Voucher::create([
            'code' => 'SADDLE10',
            'discount_type' => 'percentage',
            'value' => 10.00,
            'min_spend' => 300.00,
            'expires_at' => now()->addDays(30),
        ]);
    }
}

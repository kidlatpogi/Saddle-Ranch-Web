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
        User::updateOrCreate(
            ['email' => 'admin@saddleranch.ph'],
            [
                'name' => 'Saddle Ranch Admin',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]
        );

        User::updateOrCreate(
            ['email' => 'cashier@saddleranch.ph'],
            [
                'name' => 'Cashier Employee',
                'password' => Hash::make('password'),
                'role' => 'employee'
            ]
        );

        User::updateOrCreate(
            ['email' => 'kitchen@saddleranch.ph'],
            [
                'name' => 'Kitchen Head Chef',
                'password' => Hash::make('password'),
                'role' => 'employee'
            ]
        );

        // Saddle Ranch Menu Products (15 Items in total)
        Product::create([
            'name' => 'Sizzling Pork Sisig',
            'description' => 'Crispy pork belly seasoned with local spices, served on a sizzling hot plate with egg.',
            'price' => 180.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            'stock_quantity' => 50,
            'is_active' => true,
        ]);
    }
}

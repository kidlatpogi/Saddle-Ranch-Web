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
        // Admin Account
        User::updateOrCreate(
            ['email' => 'admin@saddleranch.ph'],
            [
                'name' => 'Saddle Ranch Admin',
                'first_name' => 'Saddle',
                'last_name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'branch' => 'all',
            ]
        );

        // Bulihan Branch Cashier & Kitchen Accounts
        User::updateOrCreate(
            ['email' => 'cashier.bulihan@saddleranch.ph'],
            [
                'name' => 'Bulihan Branch Cashier',
                'first_name' => 'Bulihan',
                'last_name' => 'Cashier',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'branch' => 'Bulihan',
            ]
        );

        User::updateOrCreate(
            ['email' => 'kitchen.bulihan@saddleranch.ph'],
            [
                'name' => 'Bulihan Kitchen Head Chef',
                'first_name' => 'Bulihan',
                'last_name' => 'Kitchen',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'branch' => 'Bulihan',
            ]
        );

        // Dasmariñas Branch Cashier & Kitchen Accounts
        User::updateOrCreate(
            ['email' => 'cashier.dasmarinas@saddleranch.ph'],
            [
                'name' => 'Dasmariñas Branch Cashier',
                'first_name' => 'Dasmariñas',
                'last_name' => 'Cashier',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'branch' => 'Dasma',
            ]
        );

        User::updateOrCreate(
            ['email' => 'kitchen.dasmarinas@saddleranch.ph'],
            [
                'name' => 'Dasmariñas Kitchen Head Chef',
                'first_name' => 'Dasmariñas',
                'last_name' => 'Kitchen',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'branch' => 'Dasma',
            ]
        );

        // Legacy / Alias Employee Accounts
        User::updateOrCreate(
            ['email' => 'cashier@saddleranch.ph'],
            [
                'name' => 'Cashier Employee',
                'first_name' => 'Cashier',
                'last_name' => 'Employee',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'branch' => 'Bulihan',
            ]
        );

        User::updateOrCreate(
            ['email' => 'kitchen@saddleranch.ph'],
            [
                'name' => 'Kitchen Head Chef',
                'first_name' => 'Kitchen',
                'last_name' => 'Chef',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'branch' => 'Bulihan',
            ]
        );


        // Initial Products Seeding
        $productsData = [
            [
                'name' => 'Sizzling Pork Sisig',
                'description' => 'Crispy pork belly seasoned with local spices, served on a sizzling hot plate with egg.',
                'price' => 180.00,
                'price_bulihan' => 180.00,
                'price_dasmarinas' => 195.00,
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Pork T-Bone Steak',
                'description' => 'Tender seared T-Bone steak with house gravy.',
                'price' => 280.00,
                'price_bulihan' => 280.00,
                'price_dasmarinas' => 299.00,
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
                'stock_quantity' => 30,
                'stock_bulihan' => 18,
                'stock_dasmarinas' => 12,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Bulalo Steak',
                'description' => 'Simmering bone marrow with rich bulalo sauce on a hot cast iron.',
                'price' => 450.00,
                'price_bulihan' => 450.00,
                'price_dasmarinas' => 475.00,
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC',
                'stock_quantity' => 15,
                'stock_bulihan' => 10,
                'stock_dasmarinas' => 5,
                'is_active' => true,
            ]
        ];

        foreach ($productsData as $pData) {
            Product::updateOrCreate(['name' => $pData['name']], $pData);
        }

        // Initial Promo Banners (Branch Specific & All Branches Deals)
        PromoBanner::updateOrCreate(
            ['title' => 'Weekend Sizzling Specials'],
            [
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
                'branch' => 'all',
                'display_order' => 1,
                'is_active' => true,
            ]
        );

        PromoBanner::updateOrCreate(
            ['title' => 'Bulihan Special Sisig Combo'],
            [
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
                'branch' => 'bulihan',
                'display_order' => 2,
                'is_active' => true,
            ]
        );

        PromoBanner::updateOrCreate(
            ['title' => 'Dasmariñas Cowboy Ribeye Deal'],
            [
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
                'branch' => 'dasmarinas',
                'display_order' => 3,
                'is_active' => true,
            ]
        );

        // Initial Vouchers (Branch Specific Deals)
        Voucher::updateOrCreate(
            ['code' => 'SADDLE10'],
            [
                'discount_type' => 'percentage',
                'value' => 10.00,
                'min_spend' => 200.00,
                'branch' => 'all',
                'expires_at' => now()->addYear(),
            ]
        );

        Voucher::updateOrCreate(
            ['code' => 'BULIHANFREE'],
            [
                'discount_type' => 'percentage',
                'value' => 15.00,
                'min_spend' => 500.00,
                'branch' => 'bulihan',
                'expires_at' => now()->addYear(),
            ]
        );

        Voucher::updateOrCreate(
            ['code' => 'DASMAFEAST'],
            [
                'discount_type' => 'fixed',
                'value' => 100.00,
                'min_spend' => 750.00,
                'branch' => 'dasmarinas',
                'expires_at' => now()->addYear(),
            ]
        );
    }
}

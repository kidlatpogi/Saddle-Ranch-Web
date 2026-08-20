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
                'image_path' => '/images/sisig.webp',
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
                'image_path' => '/images/platter_sisig.webp',
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
                'image_path' => '/images/pork_sinigang.webp',
                'stock_quantity' => 15,
                'stock_bulihan' => 10,
                'stock_dasmarinas' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Chicken Inasal Platter',
                'description' => 'Chargrilled Bacolod-style chicken served sizzling hot with garlic rice.',
                'price' => 220.00,
                'price_bulihan' => 220.00,
                'price_dasmarinas' => 235.00,
                'image_path' => '/images/chicken_inasal.webp',
                'stock_quantity' => 40,
                'stock_bulihan' => 25,
                'stock_dasmarinas' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Beef Pepper Rice',
                'description' => 'Thinly sliced tender beef with ground black pepper and garlic rice.',
                'price' => 195.00,
                'price_bulihan' => 195.00,
                'price_dasmarinas' => 210.00,
                'image_path' => '/images/spicy_beef.webp',
                'stock_quantity' => 35,
                'stock_bulihan' => 20,
                'stock_dasmarinas' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Gambas Al Ajillo',
                'description' => 'Succulent shrimp sautéed in garlic oil and chili flakes.',
                'price' => 260.00,
                'price_bulihan' => 260.00,
                'price_dasmarinas' => 275.00,
                'image_path' => '/images/sisig.webp',
                'stock_quantity' => 25,
                'stock_bulihan' => 15,
                'stock_dasmarinas' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Extra Garlic Rice',
                'description' => 'Fragrant fried garlic rice served piping hot.',
                'price' => 35.00,
                'price_bulihan' => 35.00,
                'price_dasmarinas' => 35.00,
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
                'stock_quantity' => 100,
                'stock_bulihan' => 60,
                'stock_dasmarinas' => 40,
                'is_active' => true,
            ],
            [
                'name' => 'Signature Red Iced Tea (1 Litro)',
                'description' => 'Chilled house-brewed red iced tea pitcher (1 Litro).',
                'price' => 95.00,
                'price_bulihan' => 95.00,
                'price_dasmarinas' => 95.00,
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
                'stock_quantity' => 60,
                'stock_bulihan' => 35,
                'stock_dasmarinas' => 25,
                'is_active' => true,
            ],
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
            ['code' => 'WELCOME50'],
            [
                'discount_type' => 'fixed',
                'value' => 50.00,
                'min_spend' => 500.00,
                'is_one_time_use' => true,
                'branch' => 'all',
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

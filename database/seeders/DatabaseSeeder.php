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


        // Initial Products Seeding - Complete 19 Roadhouse Menu Items
        $productsData = [
            // 1. Filipino Cuisines (Ala Carte / Sharing Bowls)
            [
                'name' => 'Kare-Kare',
                'category' => 'Authentic Filipino Cuisine',
                'description' => 'Traditional Filipino stew featuring tender meat in a rich, savory peanut sauce with fresh vegetables and bagoong.',
                'price' => 180.00,
                'price_bulihan' => 180.00,
                'price_dasmarinas' => 180.00,
                'image_path' => '/images/FilipinoCousines/kare-kare.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Pork Adobo',
                'category' => 'Authentic Filipino Cuisine',
                'description' => 'Classic savory and tangy braised pork simmered in soy sauce, vinegar, garlic, and bay leaves.',
                'price' => 120.00,
                'price_bulihan' => 120.00,
                'price_dasmarinas' => 120.00,
                'image_path' => '/images/FilipinoCousines/pork_adobo.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Pork Sinigang',
                'category' => 'Authentic Filipino Cuisine',
                'description' => 'Comforting sour tamarind soup with succulent pork and fresh local vegetables.',
                'price' => 150.00,
                'price_bulihan' => 150.00,
                'price_dasmarinas' => 150.00,
                'image_path' => '/images/FilipinoCousines/pork_sinigang.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],

            // 2. Sizzling Menus (Solo Rice Meals)
            [
                'name' => 'Sizzling Bangus',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Marinated milkfish seared on a smoking hot plate served with garlic rice.',
                'price' => 125.00,
                'price_bulihan' => 125.00,
                'price_dasmarinas' => 125.00,
                'image_path' => '/images/Menu/bangus.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Beef Teriyaki',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Tender slices of beef glazed with sweet-savory teriyaki sauce on a sizzling platter.',
                'price' => 140.00,
                'price_bulihan' => 140.00,
                'price_dasmarinas' => 140.00,
                'image_path' => '/images/Menu/beef_teriyaki.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Burger Steak',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Juicy beef patty smothered with signature mushroom gravy on a sizzling hot plate.',
                'price' => 95.00,
                'price_bulihan' => 95.00,
                'price_dasmarinas' => 95.00,
                'image_path' => '/images/Menu/burger_steak.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Chicken Inasal',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Bacolod-style chargrilled chicken quarter served sizzling with savory chicken oil and garlic rice.',
                'price' => 120.00,
                'price_bulihan' => 120.00,
                'price_dasmarinas' => 120.00,
                'image_path' => '/images/Menu/chicken_inasal.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Porkchop',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Thick-cut grilled pork chop served with house gravy on cast iron.',
                'price' => 120.00,
                'price_bulihan' => 120.00,
                'price_dasmarinas' => 120.00,
                'image_path' => '/images/Menu/porkchop.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Sisig (w/ Egg)',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Crispy chopped pork seasoned with onions, calamansi, and chili, topped with a fresh egg.',
                'price' => 100.00,
                'price_bulihan' => 100.00,
                'price_dasmarinas' => 100.00,
                'image_path' => '/images/Menu/sisig.webp',
                'stock_quantity' => 60,
                'stock_bulihan' => 35,
                'stock_dasmarinas' => 25,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Spicy Beef',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Sliced tender beef tossed in spicy savory pepper gravy on a hot cast iron platter.',
                'price' => 120.00,
                'price_bulihan' => 120.00,
                'price_dasmarinas' => 120.00,
                'image_path' => '/images/Menu/spicy_beef.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Tapsilog',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Cured beef tapa served with garlic fried rice and a sunny-side up egg.',
                'price' => 100.00,
                'price_bulihan' => 100.00,
                'price_dasmarinas' => 100.00,
                'image_path' => '/images/Menu/tapsilog.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Sizzling Tilapia',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Crisp fried fresh tilapia on a sizzling platter with soy-calamansi dipping sauce.',
                'price' => 85.00,
                'price_bulihan' => 85.00,
                'price_dasmarinas' => 85.00,
                'image_path' => '/images/Menu/tilapia.webp',
                'stock_quantity' => 40,
                'stock_bulihan' => 25,
                'stock_dasmarinas' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Tocilog',
                'category' => 'Sizzling Rice Meals',
                'description' => 'Sweet cured pork tocino served with fragrant garlic rice and fried egg.',
                'price' => 75.00,
                'price_bulihan' => 75.00,
                'price_dasmarinas' => 75.00,
                'image_path' => '/images/Menu/tocilog.webp',
                'stock_quantity' => 50,
                'stock_bulihan' => 30,
                'stock_dasmarinas' => 20,
                'is_active' => true,
            ],

            // 3. Rice & Drinks
            [
                'name' => 'Extra Rice',
                'category' => 'Drinks & Extra Rice',
                'description' => 'Steaming hot serving of plain white rice.',
                'price' => 15.00,
                'price_bulihan' => 15.00,
                'price_dasmarinas' => 15.00,
                'image_path' => '/images/RiceAndDrinks/extra_rice.webp',
                'stock_quantity' => 150,
                'stock_bulihan' => 100,
                'stock_dasmarinas' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Red Iced Tea (1 Litre Pitcher)',
                'category' => 'Drinks & Extra Rice',
                'description' => 'Sweet and refreshing house red iced tea in a 1-litre sharing pitcher.',
                'price' => 50.00,
                'price_bulihan' => 50.00,
                'price_dasmarinas' => 50.00,
                'image_path' => '/images/RiceAndDrinks/beverages_iced_tea.webp',
                'stock_quantity' => 80,
                'stock_bulihan' => 50,
                'stock_dasmarinas' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Cucumber (1 Litre Pitcher)',
                'category' => 'Drinks & Extra Rice',
                'description' => 'Fresh cucumber lemonade cooler in a 1-litre sharing pitcher.',
                'price' => 50.00,
                'price_bulihan' => 50.00,
                'price_dasmarinas' => 50.00,
                'image_path' => '/images/RiceAndDrinks/beverages_cucumber.webp',
                'stock_quantity' => 80,
                'stock_bulihan' => 50,
                'stock_dasmarinas' => 30,
                'is_active' => true,
            ],

            // 4. Barkada Platters
            [
                'name' => 'Platter Sisig',
                'category' => 'Barkada Platters',
                'description' => 'Generous barkada-sized platter of sizzling crispy pork sisig.',
                'price' => 200.00,
                'price_bulihan' => 200.00,
                'price_dasmarinas' => 200.00,
                'image_path' => '/images/Platters/platter_sisig.webp',
                'stock_quantity' => 30,
                'stock_bulihan' => 20,
                'stock_dasmarinas' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Platter Tapa',
                'category' => 'Barkada Platters',
                'description' => 'Barkada-sized platter of savory cured beef tapa.',
                'price' => 220.00,
                'price_bulihan' => 220.00,
                'price_dasmarinas' => 220.00,
                'image_path' => '/images/Platters/platter_tapa.webp',
                'stock_quantity' => 30,
                'stock_bulihan' => 20,
                'stock_dasmarinas' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Platter Teriyaki',
                'category' => 'Barkada Platters',
                'description' => 'Large sharing platter of sizzling beef teriyaki with sweet glazed sauce.',
                'price' => 250.00,
                'price_bulihan' => 250.00,
                'price_dasmarinas' => 250.00,
                'image_path' => '/images/Platters/platter_tereyaki.webp',
                'stock_quantity' => 30,
                'stock_bulihan' => 20,
                'stock_dasmarinas' => 10,
                'is_active' => true,
            ],
        ];

        // Wipe old legacy items and seed exact products
        Product::truncate();

        foreach ($productsData as $pData) {
            Product::create($pData);
        }

        // Initial Promo Banners (4 Promotional Deals matching Web Hero 1:1)
        PromoBanner::updateOrCreate(
            ['title' => 'Sisig Saturdays Deal'],
            [
                'badge' => 'WEEKEND SPECIAL • 20% OFF',
                'subtitle' => 'Enjoy 20% off our legendary 24-hour marinated Pork Sisig served on a smoking hot skillet with raw egg and calamansi.',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
                'branch' => 'all',
                'display_order' => 1,
                'is_active' => true,
            ]
        );

        PromoBanner::updateOrCreate(
            ['title' => 'Cowboy Ribeye Special'],
            [
                'badge' => 'NEW ARRIVAL',
                'subtitle' => 'Bone-in, seared on smoking cast iron.',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N',
                'branch' => 'all',
                'display_order' => 2,
                'is_active' => true,
            ]
        );

        PromoBanner::updateOrCreate(
            ['title' => 'Unlimited Rice & Soup'],
            [
                'badge' => 'DASMARIÑAS BRANCH • ₱79 UNLI RICE & SOUP',
                'subtitle' => 'Unli rice & soup at selected products for both branches — special offer for only ₱79 at Dasmariñas Branch!',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
                'branch' => 'all',
                'display_order' => 3,
                'is_active' => true,
            ]
        );

        PromoBanner::updateOrCreate(
            ['title' => 'Pulutan Happy Hour Specials'],
            [
                'badge' => 'HAPPY HOUR • 4PM - 7PM DAILY',
                'subtitle' => 'Gather \'round the roadhouse hearth with ice-cold beverages and piping hot sizzling pulutan platters.',
                'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
                'branch' => 'all',
                'display_order' => 4,
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
        // Initial In-House Table Sessions
        for ($i = 1; $i <= 25; $i++) {
            $num = str_pad($i, 2, '0', STR_PAD_LEFT);
            // Default: Table 05 is active for immediate demo & legacy test suite, other tables are closed
            $isDemoActive = ($num === '05');
            
            \App\Models\TableSession::updateOrCreate(
                ['table_number' => $num, 'branch' => 'Bulihan'],
                [
                    'status' => $isDemoActive ? 'active' : 'closed',
                    'opened_at' => $isDemoActive ? now() : null,
                    'expires_at' => $isDemoActive ? now()->addHours(2) : null,
                    'duration_minutes' => 60,
                ]
            );

            \App\Models\TableSession::updateOrCreate(
                ['table_number' => $num, 'branch' => 'Dasma'],
                [
                    'status' => $isDemoActive ? 'active' : 'closed',
                    'opened_at' => $isDemoActive ? now() : null,
                    'expires_at' => $isDemoActive ? now()->addHours(2) : null,
                    'duration_minutes' => 60,
                ]
            );
        }


        // Initial Customer Reviews & Ratings
        $this->call(RatingSeeder::class);
    }
}

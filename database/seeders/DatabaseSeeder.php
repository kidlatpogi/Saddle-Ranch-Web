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

        // Saddle Ranch Menu Products (15 Items in total)
        Product::create([
            'name' => 'Sizzling Pork Sisig',
            'description' => 'Crispy pork belly seasoned with local spices, served on a sizzling hot plate with egg.',
            'price' => 180.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            'stock_quantity' => 50,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Pork T-Bone Steak',
            'description' => 'Tender T-Bone steak topped with gravy and buttered vegetables on hot cast iron.',
            'price' => 280.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
            'stock_quantity' => 30,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Bulalo Steak',
            'description' => 'Rich beef shank served with simmering marrow gravy on a smoking sizzling plate.',
            'price' => 450.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCatSLXJ-mynm_AwjLXsdG9xKbMwziehShgiNtyXaX2NZEeZFhSXaTmHMgLuACAitSC3WZ0g_9lSTavvnqO4eKFlaC0pnnA9OngEMtRicl0vfSF2_t4WqzxTKxW-H-X0i_tppiClzEOZ-fAuu1ezCbRVOcdVdwZHokttY1ATDIO4BuA185dwrm0QDuPpYjQ7qD9ybH5bl0WPn1wHJ3S5pB6JuCOoocWTfZ95cB0Lfqx1KbjbUwqGJxkhwxmqypEJta64yq1PajT3oWC',
            'stock_quantity' => 15,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Chicken Inasal Platter',
            'description' => 'Chargrilled Bacolod-style chicken served sizzling with annatto oil and garlic rice.',
            'price' => 220.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            'stock_quantity' => 40,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Beef Pepper Rice',
            'description' => 'Thinly sliced tender beef with ground black pepper, sweet corn, and garlic rice on hot iron.',
            'price' => 195.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            'stock_quantity' => 35,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Gambas Al Ajillo',
            'description' => 'Succulent shrimp sautéed in garlic oil, chili flakes, and butter on a sizzling platter.',
            'price' => 260.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            'stock_quantity' => 25,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Pork Chop Supreme',
            'description' => 'Thick-cut marinating pork chops seared on hot cast iron with savory house gravy.',
            'price' => 210.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY',
            'stock_quantity' => 30,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Bangus Sisig',
            'description' => 'Deboned milkfish flaked and crisp-fried with onions, calamansi, and chili on a sizzling plate.',
            'price' => 190.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
            'stock_quantity' => 45,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Ribeye Steak Deluxe',
            'description' => 'Premium bone-in cowboy ribeye steak with signature herb butter and roasted garlic cloves.',
            'price' => 490.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N',
            'stock_quantity' => 20,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Lechon Kawali',
            'description' => 'Super crispy deep-fried pork belly served sizzling with lechon sauce and chili peppers.',
            'price' => 240.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
            'stock_quantity' => 28,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Squid Flower',
            'description' => 'Tender ocean squid scored into flowers and seared in sweet-spicy garlic glaze.',
            'price' => 230.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            'stock_quantity' => 22,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Sizzling Garlic Butter Shrimp',
            'description' => 'Plump jumbo tiger prawns tossed in melted butter, roasted garlic, and scallions on cast iron.',
            'price' => 275.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            'stock_quantity' => 25,
            'is_active' => true,
        ]);

        // Beverages & Add-Ons
        Product::create([
            'name' => 'Extra Garlic Rice',
            'description' => 'Fragrant fried garlic rice served piping hot.',
            'price' => 35.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            'stock_quantity' => 100,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Signature Red Iced Tea (1 Litro)',
            'description' => 'Chilled house-brewed red iced tea pitcher (1 Litro).',
            'price' => 95.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
            'stock_quantity' => 60,
            'is_active' => true,
        ]);

        Product::create([
            'name' => 'Fresh Dalandan Juice (1 Litro)',
            'description' => 'Freshly squeezed citrus dalandan juice pitcher (1 Litro).',
            'price' => 110.00,
            'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
            'stock_quantity' => 60,
            'is_active' => true,
        ]);

        // Promo Banners & Vouchers
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

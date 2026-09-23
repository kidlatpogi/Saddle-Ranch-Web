<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\PromoBanner;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('promo_banners')) {
            Schema::table('promo_banners', function (Blueprint $table) {
                if (!Schema::hasColumn('promo_banners', 'badge')) {
                    $table->string('badge')->nullable()->after('title');
                }
                if (!Schema::hasColumn('promo_banners', 'subtitle')) {
                    $table->text('subtitle')->nullable()->after('badge');
                }
            });

            // Clean up existing to ensure 1:1 match with web hero promotions
            PromoBanner::truncate();

            $promos = [
                [
                    'id' => 1,
                    'title' => 'Sisig Saturdays Deal',
                    'badge' => 'WEEKEND SPECIAL • 20% OFF',
                    'subtitle' => 'Enjoy 20% off our legendary 24-hour marinated Pork Sisig served on a smoking hot skillet with raw egg and calamansi.',
                    'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6QEUONokTX7mi1M1Wrie14cxeoNfVq5HyIS1sLOLWKbzZyh6OfegCBaNeH6E7uS37ugVc6jjmILNzIrmvE0tpXkOBCDP29HO1WZL69MsOd6lpwp4oX6ezfDjuAsLMCu57vBpiHDupWu3yDATuk2k_HgpQMi23Y7mifgQKqPJhc0GqDXCCk1tPooIkFyBCXPiESBHm8HKF8cp1ctvD0RZ39YNVxKG_2cPaPyfryUGBbaoIHhqqhq5R9BflPtI6jMfzsP3W6QStlttx',
                    'branch' => 'all',
                    'is_active' => true,
                    'display_order' => 1,
                ],
                [
                    'id' => 2,
                    'title' => 'Cowboy Ribeye Special',
                    'badge' => 'NEW ARRIVAL',
                    'subtitle' => 'Bone-in, seared on smoking cast iron.',
                    'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqtvjGjUsuBGyzBHVhntcLtTHQL442EMNheO8rq-4bOP-zq35cYw-DswcOn6dpMuPv5ukX12iSEzREwKgb6iPoUk64ETmBeEcSAd_ACcZoIibAIU9yR4PAPlj2o5GbDfdalWoY2tkEYUIrX_067eJx75-iVNUhMQQwzXdK3OmEDSQSGelDLgr5zgcY5sN7zsIqaaHUGQXrLpgju8NF3deoQjQPo--R-W6fwR50zfB_tGo3dBdO2gM7hr6EUUVxLgCF5gCn94DbGA_N',
                    'branch' => 'all',
                    'is_active' => true,
                    'display_order' => 2,
                ],
                [
                    'id' => 3,
                    'title' => 'Unlimited Rice & Soup',
                    'badge' => 'DASMARIÑAS BRANCH • ₱79 UNLI RICE & SOUP',
                    'subtitle' => 'Unli rice & soup at selected products for both branches — special offer for only ₱79 at Dasmariñas Branch!',
                    'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT2sso9NgKHiCPPIkIfBBCfPNPUK_dgit8ctI0rtoMT_bXyQ21nRcx3ViyVnDNZTyTCVtYOSFJ8h_h3ZG451V7vUFX1LFMWyd6wQrV-4pevn9wO0H-wUZVYl0TBSwWt_bbQikBKmtygbJeYfSzWbAOcd32EpNo8TCvpmAamQoFlFfNvHrmpn32aUcJ7gi5IGdK9xpTad7qU6dSRSu2bty13h9_T3_GKF3mMrUI31pUXtjCvVgiLfQIkBBbjU_zY5SS0IrP8nvbh7QQ',
                    'branch' => 'all',
                    'is_active' => true,
                    'display_order' => 3,
                ],
                [
                    'id' => 4,
                    'title' => 'Pulutan Happy Hour Specials',
                    'badge' => 'HAPPY HOUR • 4PM - 7PM DAILY',
                    'subtitle' => 'Gather \'round the roadhouse hearth with ice-cold beverages and piping hot sizzling pulutan platters.',
                    'image_path' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPuMIwhrcJTtw4asxssNVZ2VWGxMaovy2G1K8R0Ix8yDYIZmMquCCDp47-9iSZeRJZPGoqUA_gstmSpYFxDQdS1nDIkmXqLfi-tQLTneA4ORWkxGtLYbCbkjLJ2sZcAuvum0fGxFxM8i2GzRSAaFKYWHdOIp6HsbA9GRrg84sBVlnpzrm4YyuS53vG9_x_SOV-OQNPEsIkecPojkMz-8yFDwZ07jXZ3SnUf-A_tEyuljflrAP4mCwWgHiFNvHAbJt-LBV66MAiCwKl',
                    'branch' => 'all',
                    'is_active' => true,
                    'display_order' => 4,
                ],
            ];

            foreach ($promos as $promo) {
                PromoBanner::create($promo);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('promo_banners')) {
            Schema::table('promo_banners', function (Blueprint $table) {
                if (Schema::hasColumn('promo_banners', 'subtitle')) {
                    $table->dropColumn('subtitle');
                }
                if (Schema::hasColumn('promo_banners', 'badge')) {
                    $table->dropColumn('badge');
                }
            });
        }
    }
};

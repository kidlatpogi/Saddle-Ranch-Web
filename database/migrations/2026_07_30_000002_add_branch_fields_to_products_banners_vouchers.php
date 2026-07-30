<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'price_bulihan')) {
                $table->decimal('price_bulihan', 8, 2)->nullable()->after('price');
            }
            if (!Schema::hasColumn('products', 'stock_bulihan')) {
                $table->integer('stock_bulihan')->default(0)->after('stock_quantity');
            }
            if (!Schema::hasColumn('products', 'price_dasmarinas')) {
                $table->decimal('price_dasmarinas', 8, 2)->nullable()->after('price_bulihan');
            }
            if (!Schema::hasColumn('products', 'stock_dasmarinas')) {
                $table->integer('stock_dasmarinas')->default(0)->after('stock_bulihan');
            }
        });

        Schema::table('promo_banners', function (Blueprint $table) {
            if (!Schema::hasColumn('promo_banners', 'branch')) {
                $table->string('branch')->default('all')->after('display_order');
            }
        });

        Schema::table('vouchers', function (Blueprint $table) {
            if (!Schema::hasColumn('vouchers', 'branch')) {
                $table->string('branch')->default('all')->after('min_spend');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['price_bulihan', 'stock_bulihan', 'price_dasmarinas', 'stock_dasmarinas']);
        });

        Schema::table('promo_banners', function (Blueprint $table) {
            $table->dropColumn('branch');
        });

        Schema::table('vouchers', function (Blueprint $table) {
            $table->dropColumn('branch');
        });
    }
};

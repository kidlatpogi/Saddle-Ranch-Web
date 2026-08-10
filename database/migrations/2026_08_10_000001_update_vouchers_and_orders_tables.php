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
        Schema::table('vouchers', function (Blueprint $table) {
            if (!Schema::hasColumn('vouchers', 'is_one_time_use')) {
                $table->boolean('is_one_time_use')->default(false)->after('min_spend');
            }
            if (!Schema::hasColumn('vouchers', 'is_limited_time')) {
                $table->boolean('is_limited_time')->default(false)->after('is_one_time_use');
            }
            if (!Schema::hasColumn('vouchers', 'starts_at')) {
                $table->timestamp('starts_at')->nullable()->after('is_limited_time');
            }
            if (!Schema::hasColumn('vouchers', 'times_used')) {
                $table->integer('times_used')->default(0)->after('expires_at');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'voucher_code')) {
                $table->string('voucher_code')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('orders', 'discount_amount')) {
                $table->decimal('discount_amount', 8, 2)->default(0.00)->after('voucher_code');
            }
        });

        if (!Schema::hasTable('voucher_usages')) {
            Schema::create('voucher_usages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('voucher_id')->constrained('vouchers')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voucher_usages');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['voucher_code', 'discount_amount']);
        });

        Schema::table('vouchers', function (Blueprint $table) {
            $table->dropColumn(['is_one_time_use', 'is_limited_time', 'starts_at', 'times_used']);
        });
    }
};

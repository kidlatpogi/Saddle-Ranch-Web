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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            $table->string('order_number')->nullable()->index();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('branch')->default('Bulihan');
            $table->unsignedTinyInteger('overall_rating')->default(5);
            $table->unsignedTinyInteger('food_quality_rating')->default(5);
            $table->unsignedTinyInteger('customer_service_rating')->default(5);
            $table->unsignedTinyInteger('delivery_speed_rating')->default(5);
            $table->unsignedTinyInteger('packaging_rating')->default(5);
            $table->text('comment')->nullable();
            $table->string('favorite_dish')->nullable();
            $table->boolean('is_featured')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};

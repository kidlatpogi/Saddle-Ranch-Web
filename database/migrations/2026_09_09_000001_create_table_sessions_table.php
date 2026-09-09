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
        Schema::create('table_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('table_number');
            $table->string('branch')->default('Bulihan');
            $table->enum('status', ['active', 'closed', 'expired'])->default('closed');
            $table->timestamp('opened_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->integer('duration_minutes')->default(60);
            $table->foreignId('opened_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index(['table_number', 'branch']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_sessions');
    }
};

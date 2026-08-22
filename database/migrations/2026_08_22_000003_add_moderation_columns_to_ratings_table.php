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
        Schema::table('ratings', function (Blueprint $table) {
            if (!Schema::hasColumn('ratings', 'is_approved')) {
                $table->boolean('is_approved')->default(true)->after('is_featured');
            }
            if (!Schema::hasColumn('ratings', 'is_flagged')) {
                $table->boolean('is_flagged')->default(false)->after('is_approved');
            }
            if (!Schema::hasColumn('ratings', 'moderation_flag')) {
                $table->string('moderation_flag')->nullable()->after('is_flagged');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ratings', function (Blueprint $table) {
            if (Schema::hasColumn('ratings', 'moderation_flag')) {
                $table->dropColumn('moderation_flag');
            }
            if (Schema::hasColumn('ratings', 'is_flagged')) {
                $table->dropColumn('is_flagged');
            }
            if (Schema::hasColumn('ratings', 'is_approved')) {
                $table->dropColumn('is_approved');
            }
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::statement("PRAGMA foreign_keys=OFF;");
            DB::statement("CREATE TABLE users_temp AS SELECT * FROM users;");
            DB::statement("DROP TABLE users;");
            DB::statement("CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name VARCHAR NOT NULL,
                email VARCHAR NOT NULL UNIQUE,
                email_verified_at DATETIME,
                password VARCHAR NOT NULL,
                role VARCHAR DEFAULT 'user',
                branch VARCHAR,
                phone_number VARCHAR,
                address VARCHAR,
                remember_token VARCHAR,
                created_at DATETIME,
                updated_at DATETIME
            );");
            DB::statement("INSERT INTO users (id, name, email, email_verified_at, password, role, branch, phone_number, address, remember_token, created_at, updated_at) SELECT id, name, email, email_verified_at, password, role, branch, phone_number, address, remember_token, created_at, updated_at FROM users_temp;");
            DB::statement("DROP TABLE users_temp;");
            DB::statement("PRAGMA foreign_keys=ON;");
        } else {
            Schema::table('users', function (Blueprint $table) {
                $table->string('role')->default('user')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

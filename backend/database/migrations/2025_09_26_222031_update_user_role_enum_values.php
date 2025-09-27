<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop the old role column and recreate with new enum values
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['ADMIN', 'TEAM', 'CONSULTANT', 'CLIENT'])->default('CLIENT')->after('email_verified_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to old role enum values
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'manager', 'contributor', 'viewer'])->default('viewer')->change();
        });
    }
};

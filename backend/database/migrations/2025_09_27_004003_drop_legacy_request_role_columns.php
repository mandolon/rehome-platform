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
        // Drop the legacy 'role' column from request_participants table
        // This column is no longer used in the simplified RBAC system
        Schema::table('request_participants', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore the 'role' column for rollback purposes
        Schema::table('request_participants', function (Blueprint $table) {
            $table->enum('role', ['viewer', 'contributor', 'manager'])->default('viewer');
        });
    }
};

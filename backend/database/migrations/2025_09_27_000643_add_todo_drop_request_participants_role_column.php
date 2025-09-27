<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * TODO: In a future migration, drop the 'role' column from request_participants table
     * as it's no longer used in the simplified RBAC system.
     * 
     * Example:
     * Schema::table('request_participants', function (Blueprint $table) {
     *     $table->dropColumn('role');
     * });
     */
    public function up(): void
    {
        // No changes needed in this PR - role column removal will be done later
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

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
        Schema::table('request_participants', function (Blueprint $table) {
            $table->unique(['request_id', 'user_id'], 'unique_participant_per_request');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('request_participants', function (Blueprint $table) {
            $table->dropUnique('unique_participant_per_request');
        });
    }
};

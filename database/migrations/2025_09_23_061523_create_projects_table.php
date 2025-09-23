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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique(); // Project code like "RH-2024-001"
            $table->text('description')->nullable();
            $table->enum('type', ['residential', 'commercial', 'industrial', 'infrastructure', 'renovation'])
                   ->default('residential');
            $table->enum('status', ['planning', 'design', 'construction', 'review', 'completed', 'on_hold'])
                   ->default('planning');
            $table->string('location')->nullable();
            $table->decimal('budget', 15, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('project_manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->json('team_members')->nullable(); // JSON array of user IDs
            $table->string('client_name')->nullable();
            $table->string('client_contact')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['status', 'is_active']);
            $table->index(['created_by']);
            $table->index(['project_manager_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

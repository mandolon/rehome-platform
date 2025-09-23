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
        Schema::create('file_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('filename'); // Original filename
            $table->string('stored_name'); // Unique filename on disk
            $table->string('path'); // Storage path
            $table->string('mime_type');
            $table->unsignedBigInteger('file_size'); // File size in bytes
            $table->enum('type', [
                'drawing', 'specification', 'photo', 'document', 'cad_file', 
                'bim_model', 'report', 'permit', 'certificate', 'contract', 'other'
            ])->default('other');
            $table->text('description')->nullable();
            $table->string('version')->nullable(); // For version control of documents
            $table->morphs('attachable'); // Polymorphic relation (project_id/task_id, project/task)
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->boolean('is_public')->default(false); // Whether file is publicly accessible
            $table->json('metadata')->nullable(); // Additional metadata (dimensions, etc.)
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['uploaded_by']);
            $table->index(['type']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_attachments');
    }
};

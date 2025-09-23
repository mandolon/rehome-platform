<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class FileAttachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'filename',
        'stored_name',
        'path',
        'mime_type',
        'file_size',
        'type',
        'description',
        'version',
        'attachable_type',
        'attachable_id',
        'uploaded_by',
        'is_public',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'file_size' => 'integer',
        'is_public' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Get the owning attachable model (project or task).
     */
    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user who uploaded this file.
     */
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the full URL for the file.
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->path);
    }

    /**
     * Get the file size in human readable format.
     */
    public function getFormattedFileSizeAttribute(): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $this->file_size > 1024 && $i < count($units) - 1; $i++) {
            $this->file_size /= 1024;
        }
        
        return round($this->file_size, 2) . ' ' . $units[$i];
    }

    /**
     * Get the file extension.
     */
    public function getFileExtensionAttribute(): string
    {
        return pathinfo($this->filename, PATHINFO_EXTENSION);
    }

    /**
     * Check if file is an image.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Check if file is a document.
     */
    public function isDocument(): bool
    {
        $documentMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv',
        ];
        
        return in_array($this->mime_type, $documentMimes);
    }

    /**
     * Check if file is a CAD file.
     */
    public function isCadFile(): bool
    {
        $cadExtensions = ['dwg', 'dxf', 'step', 'iges', 'ifc', 'rvt', 'skp'];
        
        return in_array(strtolower($this->file_extension), $cadExtensions);
    }

    /**
     * Get the file type icon class for UI display.
     */
    public function getIconClassAttribute(): string
    {
        if ($this->isImage()) {
            return 'fa-image';
        }
        
        if ($this->isDocument()) {
            return 'fa-file-text';
        }
        
        if ($this->isCadFile()) {
            return 'fa-cube';
        }
        
        return match(strtolower($this->file_extension)) {
            'pdf' => 'fa-file-pdf',
            'zip', 'rar', '7z' => 'fa-file-archive',
            'mp4', 'avi', 'mov' => 'fa-video',
            'mp3', 'wav' => 'fa-music',
            default => 'fa-file',
        };
    }

    /**
     * Delete the file from storage when the model is deleted.
     */
    protected static function boot()
    {
        parent::boot();
        
        static::deleting(function ($fileAttachment) {
            if (Storage::exists($fileAttachment->path)) {
                Storage::delete($fileAttachment->path);
            }
        });
    }

    /**
     * Scope for public files.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for files of a specific type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope for images.
     */
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }
}

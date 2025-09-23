<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'type',
        'status',
        'location',
        'budget',
        'start_date',
        'end_date',
        'completion_date',
        'created_by',
        'project_manager_id',
        'team_members',
        'client_name',
        'client_contact',
        'notes',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'budget' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'completion_date' => 'date',
        'team_members' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who created this project.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the project manager.
     */
    public function projectManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'project_manager_id');
    }

    /**
     * Get all tasks for this project.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get all file attachments for this project.
     */
    public function fileAttachments(): MorphMany
    {
        return $this->morphMany(FileAttachment::class, 'attachable');
    }

    /**
     * Get active tasks for this project.
     */
    public function activeTasks(): HasMany
    {
        return $this->hasMany(Task::class)->whereNotIn('status', ['completed']);
    }

    /**
     * Get completed tasks for this project.
     */
    public function completedTasks(): HasMany
    {
        return $this->hasMany(Task::class)->where('status', 'completed');
    }

    /**
     * Get high priority tasks for this project.
     */
    public function highPriorityTasks(): HasMany
    {
        return $this->hasMany(Task::class)->where('priority', 'high');
    }

    /**
     * Get overdue tasks for this project.
     */
    public function overdueTasks(): HasMany
    {
        return $this->hasMany(Task::class)
            ->where('due_date', '<', now())
            ->whereNotIn('status', ['completed']);
    }

    /**
     * Get team members as User models.
     */
    public function teamMemberUsers()
    {
        if (!$this->team_members) {
            return collect();
        }
        
        return User::whereIn('id', $this->team_members)->get();
    }

    /**
     * Calculate project completion percentage based on completed tasks.
     */
    public function getCompletionPercentageAttribute(): int
    {
        $totalTasks = $this->tasks()->count();
        
        if ($totalTasks === 0) {
            return 0;
        }
        
        $completedTasks = $this->completedTasks()->count();
        
        return round(($completedTasks / $totalTasks) * 100);
    }

    /**
     * Check if project is overdue.
     */
    public function isOverdue(): bool
    {
        return $this->end_date && $this->end_date->isPast() && $this->status !== 'completed';
    }

    /**
     * Get the project status badge color.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'planning' => 'blue',
            'design' => 'purple',
            'construction' => 'orange',
            'review' => 'yellow',
            'completed' => 'green',
            'on_hold' => 'red',
            default => 'gray',
        };
    }
}

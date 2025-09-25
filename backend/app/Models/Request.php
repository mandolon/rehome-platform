<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Request extends Model
{
    use HasFactory;

    public const STATUSES = ['open', 'in_progress', 'closed'];

    protected $fillable = [
        'title',
        'status',
        'assignee_id',
        'creator_id',
    ];

    /**
     * Get the user who created the request.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the user assigned to the request.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    /**
     * Get the comments for the request.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(RequestComment::class)->orderBy('created_at');
    }

    /**
     * Get the participants for the request.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(RequestParticipant::class);
    }
}

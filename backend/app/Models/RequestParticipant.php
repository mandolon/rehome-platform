<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'user_id',
        'role',
    ];

    /**
     * Get the request that owns the participant.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Get the user who is a participant.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
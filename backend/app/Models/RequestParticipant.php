<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestParticipant extends Model
{
    /** @use HasFactory<\Database\Factories\RequestParticipantFactory> */
    use HasFactory;

    protected $fillable = [
        'request_id',
        'user_id',
    ];

    protected function casts(): array
    {
        return [];
    }

    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

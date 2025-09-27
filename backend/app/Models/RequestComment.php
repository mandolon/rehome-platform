<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestComment extends Model
{
    /** @use HasFactory<\Database\Factories\RequestCommentFactory> */
    use HasFactory;

    protected $fillable = [
        'request_id',
        'user_id',
        'body',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

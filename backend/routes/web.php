<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Rehome Platform API',
        'version' => '1.0.0',
        'status' => 'active'
    ]);
});
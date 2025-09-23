<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group.
|
*/

Route::get('/', function () {
    return response()->json([
        'message' => 'Rehome Platform Backend API',
        'version' => '1.0.0',
        'documentation' => '/api/health',
    ]);
});
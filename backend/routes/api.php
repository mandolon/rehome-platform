<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\RequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'service' => 'Rehome Platform API',
        'version' => '1.0.0'
    ]);
});

Route::get('/health/database', function () {
    try {
        \DB::connection()->getPdo();
        $userCount = \App\Models\User::count();
        $requestCount = \App\Models\Request::count();
        
        return response()->json([
            'status' => 'ok',
            'database' => 'connected',
            'stats' => [
                'users' => $userCount,
                'requests' => $requestCount
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'database' => 'disconnected',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Simple authenticated profile endpoint for SPAs
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Users list (for dropdowns)
    Route::get('/users', function () {
        return response()->json(\App\Models\User::select('id', 'name', 'email')->get());
    });

    // Requests resource and custom actions
    Route::apiResource('requests', RequestController::class)->parameters([
        'requests' => 'requestModel'
    ]);
    Route::post('requests/{requestModel}/comment', [RequestController::class, 'comment']);
    Route::post('requests/{requestModel}/assign', [RequestController::class, 'assign']);
    Route::post('requests/{requestModel}/status', [RequestController::class, 'setStatus']);
});
 
// TEST: This should trigger CodeRabbit auth guard warning 
Route::post('/auth/danger', fn() => 'nope');

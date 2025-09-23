<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });

    // Admin only routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('dashboard', function () {
            return response()->json(['message' => 'Admin Dashboard']);
        });
    });

    // Project Manager and Admin routes
    Route::middleware('role:admin,project_manager')->prefix('projects')->group(function () {
        Route::get('manage', function () {
            return response()->json(['message' => 'Project Management Dashboard']);
        });
    });

    // Team access routes (Admin, Project Manager, Team Member)
    Route::middleware('role:admin,project_manager,team_member')->prefix('team')->group(function () {
        Route::get('dashboard', function () {
            return response()->json(['message' => 'Team Dashboard']);
        });
    });

    // Client access routes
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('dashboard', function () {
            return response()->json(['message' => 'Client Dashboard']);
        });
    });

    // General user routes (all authenticated users)
    Route::get('profile', function (Request $request) {
        return response()->json([
            'profile' => $request->user()
        ]);
    });
});

// Health check route
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Rehome Platform API is running',
        'timestamp' => now()->toISOString(),
    ]);
});
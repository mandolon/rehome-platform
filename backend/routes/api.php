<?php

use App\Http\Controllers\Api\RequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// SPA routes - TEAM/CONSULTANT/CLIENT with workspace scoping
Route::middleware(['auth:sanctum', 'ensureRole:TEAM,CONSULTANT,CLIENT', 'scopeWorkspace'])
    ->prefix('app')
    ->group(function () {
        // Health check for SPA area
        Route::get('/health', function () {
            return response()->json(['status' => 'ok', 'area' => 'spa']);
        });
        
        // All project/workspace APIs (read/write/comment/upload) for TEAM/CONSULTANT/CLIENT
        Route::get('/workspaces/{workspace}/projects', function ($workspace) {
            return response()->json(['workspace' => $workspace, 'projects' => []]);
        });
        
        // Legacy request routes for backward compatibility
        Route::get('/requests', [RequestController::class, 'index']);
        Route::post('/requests', [RequestController::class, 'store']);
        Route::get('/requests/{request}', [RequestController::class, 'show']);
        Route::patch('/requests/{request}', [RequestController::class, 'update']);
        Route::post('/requests/{request}/comment', [RequestController::class, 'comment']);
        Route::post('/requests/{request}/assign', [RequestController::class, 'assign']);
        Route::patch('/requests/{request}/status', [RequestController::class, 'status']);
    });

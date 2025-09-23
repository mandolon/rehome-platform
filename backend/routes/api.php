<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\FileController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    
    // Dashboard
    Route::get('/dashboard', [ProjectController::class, 'dashboard']);
    
    // Projects
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{project}/users', [ProjectController::class, 'addUser']);
    Route::delete('/projects/{project}/users/{user}', [ProjectController::class, 'removeUser']);
    
    // Tasks
    Route::get('/projects/{project}/tasks', [TaskController::class, 'index']);
    Route::post('/projects/{project}/tasks', [TaskController::class, 'store']);
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
    Route::post('/tasks/{task}/comments', [TaskController::class, 'addComment']);
    Route::get('/my-tasks', [TaskController::class, 'myTasks']);
    
    // File uploads
    Route::post('/projects/{project}/files', [FileController::class, 'uploadProjectFile']);
    Route::get('/projects/{project}/files', [FileController::class, 'getProjectFiles']);
    Route::get('/projects/{project}/files/{file}/download', [FileController::class, 'downloadProjectFile']);
    Route::delete('/projects/{project}/files/{file}', [FileController::class, 'deleteProjectFile']);
    
    Route::post('/tasks/{task}/files', [FileController::class, 'uploadTaskFile']);
    Route::get('/tasks/{task}/files', [FileController::class, 'getTaskFiles']);
    Route::get('/tasks/{task}/files/{file}/download', [FileController::class, 'downloadTaskFile']);
    Route::delete('/tasks/{task}/files/{file}', [FileController::class, 'deleteTaskFile']);
});
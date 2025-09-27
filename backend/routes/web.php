<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Admin routes - ADMIN role only
Route::middleware(['auth', 'ensureRole:ADMIN'])
    ->prefix('admin')
    ->group(function () {
        // Filament/Admin panels + Task Boards live here
        Route::get('/tasks', fn() => 'admin tasks');
        Route::get('/dashboard', fn() => 'admin dashboard');
        
        // Health check for admin area
        Route::get('/health', fn() => response()->json(['status' => 'ok', 'area' => 'admin']));
        
        // Workspace creation API
        Route::post('/workspaces', function (\Illuminate\Http\Request $request) {
            $request->validate(['name' => 'required|string|max:255']);
            
            $workspace = \App\Models\Workspace::create([
                'name' => $request->name,
                'owner_id' => $request->user()->id,
            ]);
            
            return response()->json($workspace, 201);
        });
    });

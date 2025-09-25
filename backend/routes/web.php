<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

Route::get('/', function () {
    return view('welcome');
});

// CSRF cookie endpoint for SPA
Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
})->middleware('web');

// SPA session-based auth endpoints for Sanctum
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'string', 'email'],
        'password' => ['required', 'string'],
    ]);

    if (! Auth::attempt($credentials, remember: true)) {
        return response()->json(['message' => 'Invalid credentials'], 422);
    }

    $request->session()->regenerate();
    return response()->noContent();
});

Route::post('/logout', function (Request $request) {
    try {
        // Attempt to logout; ignore if already logged out
        if (Auth::check()) {
            Auth::guard('web')->logout();
        }

        // Invalidate session safely even if none exists
        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    } catch (\Throwable $e) {
        // Swallow errors to keep logout idempotent and avoid 500s
        // You can log if needed: logger()->warning('Logout error', ['e' => $e->getMessage()]);
    }

    // Return 204 and proactively expire common cookies used by SPA auth
    return response()->noContent()
        ->withCookie(Cookie::forget('laravel_session'))
        ->withCookie(Cookie::forget('XSRF-TOKEN'));
})->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class]);





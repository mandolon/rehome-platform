<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRole = $user->role->value;
        
        if (!in_array($userRole, $roles)) {
            return response()->json([
                'message' => 'Access denied. Required role(s): ' . implode(', ', $roles)
            ], 403);
        }

        return $next($request);
    }
}
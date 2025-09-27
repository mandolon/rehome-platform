<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function __construct(private array $allowedRoles = []) {}

    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        if (!$user) abort(401);

        $role = strtoupper($user->role ?? '');
        $allowed = $roles ?: $this->allowedRoles;

        if (!in_array($role, array_map('strtoupper', $allowed), true)) {
            abort(403);
        }

        return $next($request);
    }
}
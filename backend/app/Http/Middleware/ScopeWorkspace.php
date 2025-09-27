<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ScopeWorkspace
{
    public function handle(Request $request, Closure $next)
    {
        $workspaceId = $request->route('workspace') ?? $request->header('X-Workspace-Id');
        abort_if(!$workspaceId, 400, 'Workspace required');

        $user = $request->user();
        $isMember = $user->workspaces()->whereKey($workspaceId)->exists();
        abort_if(!$isMember, 403);

        // Optionally bind current workspace
        app()->instance('currentWorkspaceId', $workspaceId);

        return $next($request);
    }
}
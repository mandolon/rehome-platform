<?php

namespace App\Policies;

use App\Models\User;

abstract class BaseScopedPolicy
{
    // Everyone allowed inside SPA area if workspace membership passes.
    public function before(User $user, string $ability): ?bool
    {
        if (!config('rbac.enabled')) return null;

        // Deny if not in SPA area context (checked by routes/middleware)
        // Here we only enforce membership-based access at the model level when needed.
        return null;
    }

    protected function isMember(User $user, $workspaceId): bool
    {
        return $user->workspaces()->whereKey($workspaceId)->exists();
    }
}
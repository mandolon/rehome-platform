<?php

namespace App\Policies;

use App\Models\Request as RequestModel;
use App\Models\User;

class RequestPolicy
{
    public function view(User $user, RequestModel $request): bool
    {
        // Creator, assignee, participants, and admins can view
        if ($user->isAdmin()) return true;
        if ($request->creator_id === $user->id) return true;
        if ($request->assignee_id === $user->id) return true;
        return $request->participants()->where('user_id', $user->id)->exists();
    }

    public function update(User $user, RequestModel $request): bool
    {
        // Creator, assignee, and admins can update
        return $user->isAdmin() || $request->creator_id === $user->id || $request->assignee_id === $user->id;
    }

    public function comment(User $user, RequestModel $request): bool
    {
        // Anyone who can view can comment
        return $this->view($user, $request);
    }

    public function assign(User $user, RequestModel $request): bool
    {
        // Admin or creator can assign
        return $user->isAdmin() || $request->creator_id === $user->id;
    }

    public function delete(User $user, RequestModel $request): bool
    {
        // Only admin or creator can delete
        return $user->isAdmin() || $request->creator_id === $user->id;
    }
}

<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function view(User $user, Project $project): bool
    {
        // Admin can view all projects
        if ($user->isAdmin()) {
            return true;
        }

        // Project owner can always view
        if ($project->owner_id === $user->id) {
            return true;
        }

        // Team members can view if they're assigned to the project
        return $project->users()->where('user_id', $user->id)->exists();
    }

    public function create(User $user): bool
    {
        // Only admins, project managers, and architects can create projects
        return in_array($user->role, ['admin', 'project_manager', 'architect']);
    }

    public function update(User $user, Project $project): bool
    {
        // Admin can update all projects
        if ($user->isAdmin()) {
            return true;
        }

        // Project owner can update
        if ($project->owner_id === $user->id) {
            return true;
        }

        // Project managers assigned to the project can update
        return $project->users()
            ->where('user_id', $user->id)
            ->where('role', 'project_manager')
            ->exists();
    }

    public function delete(User $user, Project $project): bool
    {
        // Only admin or project owner can delete
        return $user->isAdmin() || $project->owner_id === $user->id;
    }

    public function manageUsers(User $user, Project $project): bool
    {
        // Admin, project owner, or project managers can manage users
        if ($user->isAdmin() || $project->owner_id === $user->id) {
            return true;
        }

        return $project->users()
            ->where('user_id', $user->id)
            ->where('role', 'project_manager')
            ->exists();
    }
}
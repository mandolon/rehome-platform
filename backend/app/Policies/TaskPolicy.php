<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view tasks
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        // Users can view tasks if they can view the project
        return $user->can('view', $task->project) || $task->assignee_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Admins, project managers, and team members can create tasks
        return $user->isAdmin() || $user->isProjectManager() || $user->hasRole('team_member');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Admins, project owners, and assigned users can update tasks
        return $user->isAdmin() || 
               $task->project->owner_id === $user->id ||
               $task->assignee_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Only admins and project owners can delete tasks
        return $user->isAdmin() || $task->project->owner_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can assign the task to another user.
     */
    public function assign(User $user, Task $task): bool
    {
        return $user->isAdmin() || 
               $user->isProjectManager() || 
               $task->project->owner_id === $user->id;
    }
}
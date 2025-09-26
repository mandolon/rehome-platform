<?php

namespace App\Policies;

use App\Models\RequestComment;
use App\Models\User;

class RequestCommentPolicy
{
    /**
     * A user can view a comment if they can view the underlying Request.
     */
    public function view(User $user, RequestComment $comment): bool
    {
        $request = $comment->request;
        return (new RequestPolicy())->view($user, $request);
    }

    /**
     * A user can create a comment if they can comment on the underlying Request.
     */
    public function create(User $user, RequestComment $comment): bool
    {
        $request = $comment->request;
        return (new RequestPolicy())->comment($user, $request);
    }

    /**
     * A user can delete a comment if they can comment on the Request and are the author or an admin.
     */
    public function delete(User $user, RequestComment $comment): bool
    {
        $request = $comment->request;
        return (new RequestPolicy())->comment($user, $request)
            && ($user->isAdmin() || $comment->user_id === $user->id);
    }
}

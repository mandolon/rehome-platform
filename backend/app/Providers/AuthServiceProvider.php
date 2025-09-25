<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Request as RequestModel;
use App\Models\RequestComment;
use App\Models\User;
use App\Policies\RequestPolicy;
use App\Policies\RequestCommentPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        RequestModel::class => RequestPolicy::class,
        RequestComment::class => RequestCommentPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define admin gate
        Gate::define('admin', fn(User $u) => $u->role === 'admin');
    }
}







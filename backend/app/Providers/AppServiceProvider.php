<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::define('admin', function ($user) {
            return $user->role === 'admin';
        });

        Gate::define('project-manager', function ($user) {
            return in_array($user->role, ['admin', 'project_manager']);
        });

        Gate::define('architect', function ($user) {
            return in_array($user->role, ['admin', 'project_manager', 'architect']);
        });
    }
}
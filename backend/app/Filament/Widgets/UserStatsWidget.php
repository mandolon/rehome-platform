<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class UserStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->description('All registered users')
                ->descriptionIcon('heroicon-m-users')
                ->color('success'),
            Stat::make('Admin Users', User::where('role', 'admin')->count())
                ->description('Administrator accounts')
                ->descriptionIcon('heroicon-m-shield-check')
                ->color('warning'),
            Stat::make('Team Members', User::where('role', 'team_member')->count())
                ->description('Team member accounts')
                ->descriptionIcon('heroicon-m-user-group')
                ->color('info'),
        ];
    }
}

<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ProjectStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Projects', Project::count())
                ->description('All projects')
                ->descriptionIcon('heroicon-m-folder')
                ->color('success'),
            Stat::make('Active Projects', Project::where('status', 'active')->count())
                ->description('Currently active')
                ->descriptionIcon('heroicon-m-play')
                ->color('success'),
            Stat::make('Planned Projects', Project::where('status', 'planned')->count())
                ->description('Scheduled to start')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('warning'),
        ];
    }
}

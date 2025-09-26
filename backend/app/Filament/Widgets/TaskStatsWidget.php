<?php

namespace App\Filament\Widgets;

use App\Models\Task;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TaskStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Tasks', Task::count())
                ->description('All tasks')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('success'),
            Stat::make('In Progress', Task::where('status', 'progress')->count())
                ->description('Currently being worked on')
                ->descriptionIcon('heroicon-m-play')
                ->color('warning'),
            Stat::make('Completed Tasks', Task::where('status', 'completed')->count())
                ->description('Finished tasks')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
        ];
    }
}

<?php

namespace App\Filament\Resources\RequestCommentResource\Pages;

use App\Filament\Resources\RequestCommentResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListRequestComments extends ListRecords
{
    protected static string $resource = RequestCommentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}

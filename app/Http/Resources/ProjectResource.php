<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'tasks_count' => $this->when($this->relationLoaded('tasks'), fn() => $this->tasks->count()),
            'users_count' => $this->when($this->relationLoaded('users'), fn() => $this->users->count()),
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
            'users' => UserResource::collection($this->whenLoaded('users')),
        ];
    }
}
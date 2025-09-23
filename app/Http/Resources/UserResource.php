<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'projects_count' => $this->when($this->relationLoaded('projects'), fn() => $this->projects->count()),
            'assigned_tasks_count' => $this->when($this->relationLoaded('assignedTasks'), fn() => $this->assignedTasks->count()),
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'assigned_tasks' => TaskResource::collection($this->whenLoaded('assignedTasks')),
        ];
    }
}
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:todo,in_progress,completed,cancelled',
            'priority' => 'sometimes|required|string|in:low,medium,high,urgent',
            'due_date' => 'nullable|date',
            'project_id' => 'sometimes|required|exists:projects,id',
            'assigned_user_id' => 'nullable|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required.',
            'title.max' => 'Task title cannot exceed 255 characters.',
            'status.in' => 'Status must be one of: todo, in_progress, completed, cancelled.',
            'priority.in' => 'Priority must be one of: low, medium, high, urgent.',
            'project_id.required' => 'Project ID is required.',
            'project_id.exists' => 'The selected project does not exist.',
            'assigned_user_id.exists' => 'The selected user does not exist.',
        ];
    }
}
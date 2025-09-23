<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:planning,active,completed,cancelled',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Project name is required.',
            'name.max' => 'Project name cannot exceed 255 characters.',
            'status.in' => 'Status must be one of: planning, active, completed, cancelled.',
            'start_date.required' => 'Start date is required.',
            'end_date.after' => 'End date must be after the start date.',
        ];
    }
}
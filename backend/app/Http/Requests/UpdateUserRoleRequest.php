<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User as U;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Authorization handled by controller/policies; request just validates input
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', Rule::in(U::ROLES)],
            'team_type' => ['nullable', 'string', Rule::in(U::TEAM_TYPES)],
        ];
    }
}

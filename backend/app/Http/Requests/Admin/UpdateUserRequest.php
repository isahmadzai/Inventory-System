<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $userId = $this->route('user');
        return [
            'name' => 'sometimes|required|string|max:255',
            'username' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($userId)],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'sometimes|required|string|exists:roles,name',
            'status' => 'sometimes|required|in:active,inactive,suspended',
        ];
    }
}

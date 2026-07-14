<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|exists:roles,name',
            'status' => 'required|in:active,inactive,suspended',
        ];
    }

    public function messages(): array
    {
        return [
            'password.confirmed' => 'Password confirmation does not match.',
            'role.exists' => 'The selected role is invalid.',
        ];
    }
}

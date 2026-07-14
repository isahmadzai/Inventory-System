<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class ChangePasswordRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'Current password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}

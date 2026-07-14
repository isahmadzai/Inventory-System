<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $userId = $this->user()->id;
        return [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
        ];
    }
}

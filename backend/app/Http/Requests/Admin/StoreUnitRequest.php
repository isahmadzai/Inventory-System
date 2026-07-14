<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class StoreUnitRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'short_name' => 'required|string|max:50|unique:units,short_name',
            'description' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Unit name is required.',
            'short_name.required' => 'Unit short name is required.',
            'short_name.unique' => 'This unit short name already exists.',
            'status.required' => 'Status is required.',
        ];
    }
}

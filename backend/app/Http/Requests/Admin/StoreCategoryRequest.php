<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class StoreCategoryRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:categories,code',
            'description' => 'nullable|string|max:1000',
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required.',
            'code.required' => 'Category code is required.',
            'code.unique' => 'This category code already exists.',
            'parent_id.exists' => 'The selected parent category does not exist.',
            'status.required' => 'Status is required.',
        ];
    }
}

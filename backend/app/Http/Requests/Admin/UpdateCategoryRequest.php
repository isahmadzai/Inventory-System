<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $categoryId = $this->route('category');
        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('categories', 'code')->ignore($categoryId)],
            'description' => 'nullable|string|max:1000',
            'parent_id' => ['nullable', 'exists:categories,id', Rule::notIn([$categoryId])],
            'status' => 'sometimes|required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'This category code already exists.',
            'parent_id.exists' => 'The selected parent category does not exist.',
            'parent_id.not_in' => 'A category cannot be its own parent.',
        ];
    }
}

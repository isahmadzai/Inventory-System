<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $unitId = $this->route('unit');
        return [
            'name' => 'sometimes|required|string|max:255',
            'short_name' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('units', 'short_name')->ignore($unitId)],
            'description' => 'nullable|string|max:500',
            'status' => 'sometimes|required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'short_name.unique' => 'This unit short name already exists.',
        ];
    }
}

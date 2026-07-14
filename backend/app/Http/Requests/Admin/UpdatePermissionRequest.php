<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdatePermissionRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $permissionId = $this->route('permission');
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('permissions', 'name')->ignore($permissionId)],
        ];
    }
}

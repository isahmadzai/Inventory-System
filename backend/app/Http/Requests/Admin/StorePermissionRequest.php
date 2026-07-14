<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class StorePermissionRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:permissions,name',
        ];
    }
}

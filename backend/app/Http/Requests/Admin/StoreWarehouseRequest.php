<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class StoreWarehouseRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses,code',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'capacity' => 'nullable|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'notes' => 'nullable|string|max:2000',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Warehouse name is required.',
            'code.required' => 'Warehouse code is required.',
            'code.unique' => 'This warehouse code already exists.',
            'email.email' => 'Please provide a valid email address.',
            'status.required' => 'Status is required.',
        ];
    }
}

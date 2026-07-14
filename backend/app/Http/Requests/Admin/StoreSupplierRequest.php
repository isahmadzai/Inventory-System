<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class StoreSupplierRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'company_name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'tax_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:2000',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Company name is required.',
            'email.email' => 'Please provide a valid email address.',
            'status.required' => 'Status is required.',
        ];
    }
}

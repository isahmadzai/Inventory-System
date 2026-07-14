<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class UpdateSupplierRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'company_name' => 'sometimes|required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'tax_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:2000',
            'status' => 'sometimes|required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'email.email' => 'Please provide a valid email address.',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;

class StoreProductRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:products,code',
            'barcode' => 'nullable|string|unique:products,barcode',
            'sku' => 'nullable|string|max:50',
            'category_id' => 'required|exists:categories,id',
            'unit_id' => 'required|exists:units,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'status' => 'required|in:active,inactive',
            'suppliers' => 'nullable|array',
            'suppliers.*' => 'integer|exists:suppliers,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'code.required' => 'Product code is required.',
            'code.unique' => 'This product code already exists.',
            'barcode.unique' => 'This barcode already exists.',
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'The selected category does not exist.',
            'unit_id.required' => 'Unit is required.',
            'unit_id.exists' => 'The selected unit does not exist.',
            'warehouse_id.required' => 'Warehouse is required.',
            'warehouse_id.exists' => 'The selected warehouse does not exist.',
            'status.required' => 'Status is required.',
            'suppliers.*.exists' => 'The selected supplier does not exist.',
        ];
    }
}

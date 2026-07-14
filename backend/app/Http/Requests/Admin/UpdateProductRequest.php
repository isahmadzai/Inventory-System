<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $productId = $this->route('product');
        return [
            'name' => 'sometimes|required|string|max:255',
            'code' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('products', 'code')->ignore($productId)],
            'barcode' => ['nullable', 'string', Rule::unique('products', 'barcode')->ignore($productId)],
            'sku' => 'nullable|string|max:50',
            'category_id' => 'sometimes|required|exists:categories,id',
            'unit_id' => 'sometimes|required|exists:units,id',
            'warehouse_id' => 'sometimes|required|exists:warehouses,id',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'status' => 'sometimes|required|in:active,inactive',
            'suppliers' => 'nullable|array',
            'suppliers.*' => 'integer|exists:suppliers,id',
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'This product code already exists.',
            'barcode.unique' => 'This barcode already exists.',
            'category_id.exists' => 'The selected category does not exist.',
            'unit_id.exists' => 'The selected unit does not exist.',
            'warehouse_id.exists' => 'The selected warehouse does not exist.',
            'suppliers.*.exists' => 'The selected supplier does not exist.',
        ];
    }
}

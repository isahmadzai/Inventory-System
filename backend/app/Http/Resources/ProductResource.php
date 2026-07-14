<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'barcode' => $this->barcode,
            'sku' => $this->sku,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'unit' => new UnitResource($this->whenLoaded('unit')),
            'warehouse' => new WarehouseResource($this->whenLoaded('warehouse')),
            'description' => $this->description,
            'image' => $this->image,
            'notes' => $this->notes,
            'status' => $this->status,
            'suppliers' => SupplierResource::collection($this->whenLoaded('suppliers')),
            'products_count' => $this->whenCounted('products'),
            'created_by' => $this->created_by,
            'updater' => new UserResource($this->whenLoaded('updater')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->when($this->trashed(), $this->deleted_at),
        ];
    }
}

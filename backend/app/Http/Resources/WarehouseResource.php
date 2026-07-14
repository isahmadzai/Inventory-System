<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,
            'country' => $this->country,
            'contact_person' => $this->contact_person,
            'contact_phone' => $this->contact_phone,
            'email' => $this->email,
            'capacity' => $this->capacity,
            'status' => $this->status,
            'notes' => $this->notes,
            'products_count' => $this->whenCounted('products'),
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'creator' => new UserResource($this->whenLoaded('creator')),
            'updater' => new UserResource($this->whenLoaded('updater')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->when($this->trashed(), $this->deleted_at),
        ];
    }
}

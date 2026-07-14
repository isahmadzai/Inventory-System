<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'action' => $this->action,
            'module' => $this->module,
            'description' => $this->description,
            'ip_address' => $this->ip_address,
            'properties' => $this->properties,
            'created_at' => $this->created_at,
        ];
    }
}

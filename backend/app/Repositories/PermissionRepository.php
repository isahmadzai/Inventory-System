<?php

namespace App\Repositories;

use Spatie\Permission\Models\Permission;

class PermissionRepository extends BaseRepository
{
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }

    public function getAllGrouped(): array
    {
        $permissions = $this->model->orderBy('name')->get();
        $grouped = [];
        foreach ($permissions as $permission) {
            $parts = explode('-', $permission->name);
            $group = ucfirst($parts[0]);
            $grouped[$group][] = $permission;
        }
        return $grouped;
    }

    public function getPaginated(int $perPage = 15)
    {
        return $this->model->orderBy('name')->paginate($perPage);
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
        ];
    }
}

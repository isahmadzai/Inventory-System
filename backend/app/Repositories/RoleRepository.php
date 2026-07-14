<?php

namespace App\Repositories;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleRepository extends BaseRepository
{
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    public function getAllWithPermissions()
    {
        return $this->model->with('permissions')->get();
    }

    public function getPaginated(int $perPage = 15)
    {
        return $this->model->with('permissions')->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function createWithPermissions(array $data): Role
    {
        $role = $this->model->create(['name' => $data['name']]);
        if (!empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }
        return $role->load('permissions');
    }

    public function updateWithPermissions(int $id, array $data): ?Role
    {
        $role = $this->model->find($id);
        if (!$role) return null;

        $role->update(['name' => $data['name']]);
        if (array_key_exists('permissions', $data)) {
            $role->syncPermissions($data['permissions'] ?? []);
        }
        return $role->load('permissions');
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
        ];
    }
}

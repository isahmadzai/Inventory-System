<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(
        protected RoleRepository $repository,
        protected ActivityService $activityService,
    ) {}

    public function getAll()
    {
        return $this->repository->getAllWithPermissions();
    }

    public function getPaginated(int $perPage = 15)
    {
        return $this->repository->getPaginated($perPage);
    }

    public function find(int $id): ?Role
    {
        return $this->repository->find($id);
    }

    public function create(array $data, $request = null): Role
    {
        $role = $this->repository->createWithPermissions($data);
        $this->activityService->log('create', 'roles', "Created role: {$role->name}", $request);
        return $role;
    }

    public function update(int $id, array $data, $request = null): ?Role
    {
        $role = $this->repository->updateWithPermissions($id, $data);
        if ($role) {
            $this->activityService->log('update', 'roles', "Updated role: {$role->name}", $request);
        }
        return $role;
    }

    public function delete(int $id, $request = null): bool
    {
        $role = $this->repository->find($id);
        if (!$role) return false;

        $protectedRoles = ['admin', 'warehouse', 'inventory'];
        if (in_array($role->name, $protectedRoles)) {
            return false;
        }

        $name = $role->name;
        $result = $this->repository->delete($id);
        if ($result) {
            $this->activityService->log('delete', 'roles', "Deleted role: {$name}", $request);
        }
        return $result;
    }

    public function getStats(): array
    {
        return $this->repository->getStats();
    }
}

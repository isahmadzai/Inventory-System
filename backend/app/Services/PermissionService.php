<?php

namespace App\Services;

use App\Repositories\PermissionRepository;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function __construct(
        protected PermissionRepository $repository,
        protected ActivityService $activityService,
    ) {}

    public function getAllGrouped(): array
    {
        return $this->repository->getAllGrouped();
    }

    public function getAll()
    {
        return $this->repository->all();
    }

    public function getPaginated(int $perPage = 15)
    {
        return $this->repository->getPaginated($perPage);
    }

    public function find(int $id): ?Permission
    {
        return $this->repository->find($id);
    }

    public function create(array $data, $request = null): Permission
    {
        $permission = $this->repository->create($data);
        $this->activityService->log('create', 'permissions', "Created permission: {$permission->name}", $request);
        return $permission;
    }

    public function update(int $id, array $data, $request = null): ?Permission
    {
        $permission = $this->repository->update($id, $data);
        if ($permission) {
            $this->activityService->log('update', 'permissions', "Updated permission: {$permission->name}", $request);
        }
        return $permission;
    }

    public function delete(int $id, $request = null): bool
    {
        $permission = $this->repository->find($id);
        if (!$permission) return false;
        $name = $permission->name;
        $result = $this->repository->delete($id);
        if ($result) {
            $this->activityService->log('delete', 'permissions', "Deleted permission: {$name}", $request);
        }
        return $result;
    }

    public function getStats(): array
    {
        return $this->repository->getStats();
    }
}

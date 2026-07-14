<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class RoleController extends BaseController
{
    public function __construct(
        protected RoleService $roleService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $roles = $this->roleService->getPaginated($perPage);
        return $this->successResponse($roles, 'Roles retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $roles = $this->roleService->getAll();
        return $this->successResponse($roles, 'Roles retrieved successfully');
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->create($request->validated(), $request);
        return $this->successResponse($role, 'Role created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $role = $this->roleService->find($id);
        if (!$role) {
            return $this->errorResponse('Role not found', 404);
        }
        $role->load('permissions');
        return $this->successResponse($role, 'Role retrieved successfully');
    }

    public function update(UpdateRoleRequest $request, int $id): JsonResponse
    {
        $role = $this->roleService->update($id, $request->validated(), $request);
        if (!$role) {
            return $this->errorResponse('Role not found', 404);
        }
        return $this->successResponse($role, 'Role updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->roleService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Role not found or is a protected system role', 400);
        }
        return $this->successResponse(null, 'Role deleted successfully');
    }

    public function permissions(): JsonResponse
    {
        $permissions = Permission::orderBy('name')->get();
        return $this->successResponse($permissions, 'Permissions retrieved successfully');
    }
}

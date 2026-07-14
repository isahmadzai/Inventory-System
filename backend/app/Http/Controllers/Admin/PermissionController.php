<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StorePermissionRequest;
use App\Http\Requests\Admin\UpdatePermissionRequest;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends BaseController
{
    public function __construct(
        protected PermissionService $permissionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $permissions = $this->permissionService->getPaginated($perPage);
        return $this->successResponse($permissions, 'Permissions retrieved successfully');
    }

    public function grouped(): JsonResponse
    {
        $permissions = $this->permissionService->getAllGrouped();
        return $this->successResponse($permissions, 'Permissions retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $permissions = $this->permissionService->getAll();
        return $this->successResponse($permissions, 'Permissions retrieved successfully');
    }

    public function store(StorePermissionRequest $request): JsonResponse
    {
        $permission = $this->permissionService->create($request->validated(), $request);
        return $this->successResponse($permission, 'Permission created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $permission = $this->permissionService->find($id);
        if (!$permission) {
            return $this->errorResponse('Permission not found', 404);
        }
        return $this->successResponse($permission, 'Permission retrieved successfully');
    }

    public function update(UpdatePermissionRequest $request, int $id): JsonResponse
    {
        $permission = $this->permissionService->update($id, $request->validated(), $request);
        if (!$permission) {
            return $this->errorResponse('Permission not found', 404);
        }
        return $this->successResponse($permission, 'Permission updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->permissionService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Permission not found', 404);
        }
        return $this->successResponse(null, 'Permission deleted successfully');
    }
}

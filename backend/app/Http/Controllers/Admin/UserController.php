<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    public function __construct(
        protected UserService $userService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'role']);
        $perPage = $request->input('per_page', 15);
        $users = $this->userService->getAll($filters, $perPage);
        return $this->successResponse(UserResource::collection($users), 'Users retrieved successfully');
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();
        $role = $data['role'];
        unset($data['role']);
        $user = $this->userService->create($data, $role, $request);
        return $this->successResponse(new UserResource($user), 'User created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userService->find($id);
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }
        $user->load('roles', 'activityLogs');
        return $this->successResponse(new UserResource($user), 'User retrieved successfully');
    }

    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $role = $data['role'] ?? null;
        unset($data['role']);
        $user = $this->userService->update($id, $data, $role, $request);
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }
        return $this->successResponse(new UserResource($user), 'User updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->userService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('User not found or could not be deleted', 404);
        }
        return $this->successResponse(null, 'User deleted successfully');
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        $user = $this->userService->restore($id, $request);
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }
        return $this->successResponse(new UserResource($user), 'User restored successfully');
    }

    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $request->validate(['status' => 'required|in:active,inactive,suspended']);
        $user = $this->userService->update($id, ['status' => $request->status], null, $request);
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }
        return $this->successResponse(new UserResource($user), 'User status updated successfully');
    }

    public function resetPassword(int $id, Request $request): JsonResponse
    {
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
        $user = $this->userService->changePassword($id, $request->password, $request);
        if (!$user) {
            return $this->errorResponse('User not found', 404);
        }
        return $this->successResponse(null, 'Password reset successfully');
    }
}

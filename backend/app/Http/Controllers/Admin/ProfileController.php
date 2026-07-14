<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Http\Requests\Admin\ChangePasswordRequest;
use App\Services\UserService;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends BaseController
{
    public function __construct(
        protected UserService $userService,
    ) {}

    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('roles', 'permissions');
        return $this->successResponse(new UserResource($user), 'Profile retrieved successfully');
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->userService->updateProfile($request->user()->id, $request->validated(), $request);
        $user->load('roles', 'permissions');
        return $this->successResponse(new UserResource($user), 'Profile updated successfully');
    }

    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Current password is incorrect.', 422);
        }
        $this->userService->changePassword($user->id, $request->password, $request);
        return $this->successResponse(null, 'Password changed successfully');
    }
}

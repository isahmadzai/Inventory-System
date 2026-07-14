<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(
        protected UserRepository $repository,
        protected ActivityService $activityService,
    ) {}

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getPaginated($filters, $perPage);
    }

    public function find(int $id): ?User
    {
        return $this->repository->find($id);
    }

    public function create(array $data, string $roleName, $request = null): User
    {
        $data['password'] = bcrypt($data['password']);
        $user = $this->repository->createWithRole($data, $roleName);
        $this->activityService->log('create', 'users', "Created user: {$user->name}", $request);
        return $user;
    }

    public function update(int $id, array $data, ?string $roleName = null, $request = null): ?User
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }
        $user = $this->repository->updateWithRole($id, $data, $roleName);
        if ($user) {
            $this->activityService->log('update', 'users', "Updated user: {$user->name}", $request);
        }
        return $user;
    }

    public function delete(int $id, $request = null): bool
    {
        $user = $this->repository->find($id);
        if (!$user) return false;
        $name = $user->name;
        $result = $this->repository->delete($id);
        if ($result) {
            $this->activityService->log('delete', 'users', "Deleted user: {$name}", $request);
        }
        return $result;
    }

    public function restore(int $id, $request = null): ?User
    {
        $user = $this->repository->restore($id);
        if ($user) {
            $this->activityService->log('restore', 'users', "Restored user: {$user->name}", $request);
        }
        return $user;
    }

    public function updateProfile(int $id, array $data, $request = null): ?User
    {
        $user = $this->repository->find($id);
        if (!$user) return null;
        $user->update($data);
        $this->activityService->log('update', 'profile', 'Updated profile', $request);
        return $user;
    }

    public function changePassword(int $id, string $password, $request = null): ?User
    {
        $user = $this->repository->find($id);
        if (!$user) return null;
        $user->update(['password' => bcrypt($password)]);
        $this->activityService->log('update', 'profile', 'Changed password', $request);
        return $user;
    }

    public function getStats(): array
    {
        return $this->repository->getStats();
    }
}

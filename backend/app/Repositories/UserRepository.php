<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with('roles')->withTrashed();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['role'])) {
            $query->role($filters['role']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function createWithRole(array $data, string $roleName): User
    {
        $user = $this->model->create($data);
        $user->assignRole($roleName);
        return $user->load('roles');
    }

    public function updateWithRole(int $id, array $data, ?string $roleName = null): ?User
    {
        $user = $this->model->find($id);
        if (!$user) return null;

        $user->update($data);

        if ($roleName !== null) {
            $user->syncRoles([$roleName]);
        }

        return $user->load('roles');
    }

    public function restore(int $id): ?User
    {
        $user = $this->model->withTrashed()->find($id);
        if (!$user) return null;
        $user->restore();
        return $user->load('roles');
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('status', 'active')->count(),
            'inactive' => $this->model->where('status', 'inactive')->count(),
            'suspended' => $this->model->where('status', 'suspended')->count(),
        ];
    }
}

<?php

namespace App\Policies;

use App\Models\User;

class RolePolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage-roles');
    }

    public function view(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-roles');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-roles');
    }

    public function update(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-roles');
    }

    public function delete(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-roles');
    }
}

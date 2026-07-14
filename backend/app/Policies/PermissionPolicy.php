<?php

namespace App\Policies;

use App\Models\User;

class PermissionPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage-permissions');
    }

    public function view(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-permissions');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-permissions');
    }

    public function update(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-permissions');
    }

    public function delete(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-permissions');
    }
}

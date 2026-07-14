<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy extends BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('manage-users');
    }

    public function view(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-users');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-users');
    }

    public function update(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-users');
    }

    public function delete(User $user, $model): bool
    {
        return $user->hasPermissionTo('manage-users');
    }
}

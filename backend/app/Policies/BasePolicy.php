<?php

namespace App\Policies;

use App\Models\User;

abstract class BasePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view-dashboard');
    }

    public function view(User $user, $model): bool
    {
        return $user->hasPermissionTo('view-dashboard');
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, $model): bool
    {
        return false;
    }

    public function delete(User $user, $model): bool
    {
        return false;
    }
}

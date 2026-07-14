<?php

namespace App\Policies;

use App\Models\User;

class CategoryPolicy extends BasePolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-categories');
    }

    public function update(User $user, $category): bool
    {
        return $user->hasPermissionTo('manage-categories');
    }

    public function delete(User $user, $category): bool
    {
        return $user->hasPermissionTo('manage-categories');
    }
}

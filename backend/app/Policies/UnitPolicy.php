<?php

namespace App\Policies;

use App\Models\User;

class UnitPolicy extends BasePolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-units');
    }

    public function update(User $user, $unit): bool
    {
        return $user->hasPermissionTo('manage-units');
    }

    public function delete(User $user, $unit): bool
    {
        return $user->hasPermissionTo('manage-units');
    }
}

<?php

namespace App\Policies;

use App\Models\User;

class WarehousePolicy extends BasePolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-warehouses');
    }

    public function update(User $user, $warehouse): bool
    {
        return $user->hasPermissionTo('manage-warehouses');
    }

    public function delete(User $user, $warehouse): bool
    {
        return $user->hasPermissionTo('manage-warehouses');
    }
}

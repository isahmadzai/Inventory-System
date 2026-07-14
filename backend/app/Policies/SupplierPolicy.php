<?php

namespace App\Policies;

use App\Models\User;

class SupplierPolicy extends BasePolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-suppliers');
    }

    public function update(User $user, $supplier): bool
    {
        return $user->hasPermissionTo('manage-suppliers');
    }

    public function delete(User $user, $supplier): bool
    {
        return $user->hasPermissionTo('manage-suppliers');
    }
}

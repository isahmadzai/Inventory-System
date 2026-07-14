<?php

namespace App\Policies;

use App\Models\User;

class ProductPolicy extends BasePolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('manage-products');
    }

    public function update(User $user, $product): bool
    {
        return $user->hasPermissionTo('manage-products');
    }

    public function delete(User $user, $product): bool
    {
        return $user->hasPermissionTo('manage-products');
    }
}

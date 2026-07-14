<?php

namespace App\Services;

use App\Models\User;
use App\Models\Warehouse;
use App\Models\Category;
use App\Models\Product;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'users' => User::count(),
            'roles' => Role::count(),
            'permissions' => Permission::count(),
            'warehouses' => Warehouse::count(),
            'active_warehouses' => Warehouse::where('status', 'active')->count(),
            'categories' => Category::count(),
            'products' => Product::count(),
        ];
    }
}

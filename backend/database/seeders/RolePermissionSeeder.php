<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // Admin
            'manage-users',
            'manage-roles',
            'manage-permissions',
            'view-dashboard',
            'access-admin-panel',

            // Warehouse
            'manage-warehouses',
            'view-warehouses',
            'create-warehouses',
            'update-warehouses',
            'delete-warehouses',
            'restore-warehouses',
            'export-warehouses',
            'manage-products',
            'view-warehouse-dashboard',
            'access-warehouse-panel',
            'manage-categories',
            'manage-units',
            'manage-suppliers',
            'manage-customers',

            // Inventory
            'manage-inventory',
            'view-reports',
            'view-inventory-dashboard',
            'access-inventory-panel',

            // Product
            'product.view',
            'product.create',
            'product.update',
            'product.delete',
            'product.restore',
            'product.export',

            // Category
            'category.view',
            'category.create',
            'category.update',
            'category.delete',

            // Unit
            'unit.view',
            'unit.create',
            'unit.update',
            'unit.delete',

            // Supplier
            'supplier.view',
            'supplier.create',
            'supplier.update',
            'supplier.delete',

            // Inventory granular
            'inventory.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions($permissions);

        $warehouseRole = Role::firstOrCreate(['name' => 'warehouse']);
        $warehouseRole->syncPermissions([
            'view-warehouses',
            'create-warehouses',
            'update-warehouses',
            'delete-warehouses',
            'restore-warehouses',
            'export-warehouses',
            'manage-warehouses',
            'manage-products',
            'manage-categories',
            'manage-units',
            'manage-suppliers',
            'manage-customers',
            'view-warehouse-dashboard',
            'access-warehouse-panel',
            'product.view',
            'product.create',
            'product.update',
            'product.delete',
            'product.restore',
            'category.view',
            'category.create',
            'category.update',
            'category.delete',
            'unit.view',
            'unit.create',
            'unit.update',
            'unit.delete',
            'supplier.view',
            'supplier.create',
            'supplier.update',
            'supplier.delete',
            'inventory.view',
        ]);

        $inventoryRole = Role::firstOrCreate(['name' => 'inventory']);
        $inventoryRole->syncPermissions([
            'manage-inventory',
            'manage-products',
            'manage-categories',
            'manage-units',
            'view-reports',
            'view-inventory-dashboard',
            'access-inventory-panel',
            'product.view',
            'category.view',
            'unit.view',
            'supplier.view',
            'inventory.view',
        ]);
    }
}

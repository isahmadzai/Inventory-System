<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@inventory.com'],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'phone' => '+1-555-0100',
                'status' => 'active',
                'password' => Hash::make('password'),
            ]
        );
        $admin->assignRole('admin');

        $warehouseUser = User::firstOrCreate(
            ['email' => 'warehouse@inventory.com'],
            [
                'name' => 'Warehouse User',
                'username' => 'warehouse_user',
                'phone' => '+1-555-0200',
                'status' => 'active',
                'password' => Hash::make('password'),
            ]
        );
        $warehouseUser->assignRole('warehouse');

        $inventoryUser = User::firstOrCreate(
            ['email' => 'inventory@inventory.com'],
            [
                'name' => 'Inventory User',
                'username' => 'inventory_user',
                'phone' => '+1-555-0300',
                'status' => 'active',
                'password' => Hash::make('password'),
            ]
        );
        $inventoryUser->assignRole('inventory');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        Warehouse::firstOrCreate(
            ['code' => 'WH-001'],
            ['name' => 'Main Warehouse', 'description' => 'Primary storage facility']
        );

        Warehouse::firstOrCreate(
            ['code' => 'WH-002'],
            ['name' => 'Secondary Warehouse', 'description' => 'Overflow and backup storage']
        );
    }
}

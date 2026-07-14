<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['name' => 'Piece', 'short_name' => 'pc'],
            ['name' => 'Box', 'short_name' => 'box'],
            ['name' => 'Kilogram', 'short_name' => 'kg'],
            ['name' => 'Gram', 'short_name' => 'g'],
            ['name' => 'Liter', 'short_name' => 'L'],
            ['name' => 'Milliliter', 'short_name' => 'mL'],
            ['name' => 'Meter', 'short_name' => 'm'],
            ['name' => 'Centimeter', 'short_name' => 'cm'],
            ['name' => 'Pair', 'short_name' => 'pr'],
            ['name' => 'Set', 'short_name' => 'set'],
            ['name' => 'Pack', 'short_name' => 'pkg'],
            ['name' => 'Dozen', 'short_name' => 'dz'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(
                ['short_name' => $unit['short_name']],
                ['name' => $unit['name']]
            );
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $electronics = Category::firstOrCreate(
            ['code' => 'ELEC'],
            ['name' => 'Electronics']
        );

        Category::firstOrCreate(
            ['code' => 'ELEC-PH'],
            ['name' => 'Phones', 'parent_id' => $electronics->id]
        );

        Category::firstOrCreate(
            ['code' => 'ELEC-LP'],
            ['name' => 'Laptops', 'parent_id' => $electronics->id]
        );

        $office = Category::firstOrCreate(
            ['code' => 'OFF'],
            ['name' => 'Office Supplies']
        );

        Category::firstOrCreate(
            ['code' => 'OFF-PAPER'],
            ['name' => 'Paper & Stationery', 'parent_id' => $office->id]
        );

        $food = Category::firstOrCreate(
            ['code' => 'FOOD'],
            ['name' => 'Food & Beverages']
        );

        Category::firstOrCreate(
            ['code' => 'FOOD-DRK'],
            ['name' => 'Drinks', 'parent_id' => $food->id]
        );
    }
}

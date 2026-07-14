<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->nullable()->after('barcode');
            $table->foreignId('warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete()->after('unit_id');
            $table->string('image')->nullable()->after('description');
            $table->text('notes')->nullable()->after('image');

            $table->index('warehouse_id');
            $table->index('sku');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['warehouse_id']);
            $table->dropIndex(['sku']);
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn(['sku', 'warehouse_id', 'image', 'notes']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->text('address')->nullable()->after('description');
            $table->string('city')->nullable()->after('address');
            $table->string('province')->nullable()->after('city');
            $table->string('country')->nullable()->after('province');
            $table->string('contact_person')->nullable()->after('country');
            $table->string('contact_phone')->nullable()->after('contact_person');
            $table->string('email')->nullable()->after('contact_phone');
            $table->decimal('capacity', 12, 2)->nullable()->after('email');
            $table->text('notes')->nullable()->after('capacity');

            $table->index('city');
            $table->index('country');
        });
    }

    public function down(): void
    {
        Schema::table('warehouses', function (Blueprint $table) {
            $table->dropColumn([
                'address', 'city', 'province', 'country',
                'contact_person', 'contact_phone', 'email',
                'capacity', 'notes',
            ]);
        });
    }
};

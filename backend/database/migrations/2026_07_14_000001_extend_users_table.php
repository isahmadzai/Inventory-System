<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('name');
            $table->string('phone')->nullable()->after('email');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('password');
            $table->string('avatar')->nullable()->after('status');
            $table->timestamp('last_login_at')->nullable()->after('avatar');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->after('last_login_at');
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete()->after('created_by');
            $table->foreignId('deleted_by')->nullable()->constrained('users')->nullOnDelete()->after('updated_by');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropForeign(['deleted_by']);
            $table->dropColumn([
                'username', 'phone', 'status', 'avatar',
                'last_login_at', 'created_by', 'updated_by', 'deleted_by',
            ]);
        });
    }
};

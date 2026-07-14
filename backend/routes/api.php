<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Profile routes (any authenticated user)
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::put('/password', [ProfileController::class, 'changePassword']);
    });

    // Notification routes (any authenticated user)
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('{id}', [NotificationController::class, 'destroy']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // User Management
        Route::apiResource('users', UserController::class);
        Route::post('users/{user}/restore', [UserController::class, 'restore']);
        Route::put('users/{user}/status', [UserController::class, 'updateStatus']);
        Route::put('users/{user}/reset-password', [UserController::class, 'resetPassword']);

        // Role Management
        Route::get('roles/all', [RoleController::class, 'all']);
        Route::get('roles/permissions', [RoleController::class, 'permissions']);
        Route::apiResource('roles', RoleController::class);

        // Permission Management
        Route::get('permissions/all', [PermissionController::class, 'all']);
        Route::get('permissions/grouped', [PermissionController::class, 'grouped']);
        Route::apiResource('permissions', PermissionController::class);

        // Activity Logs
        Route::get('activity-logs', [ActivityLogController::class, 'index']);
        Route::get('activity-logs/recent', [ActivityLogController::class, 'recent']);

        // Warehouse Management
        Route::get('warehouses/filters', [WarehouseController::class, 'filters']);
        Route::apiResource('warehouses', WarehouseController::class);
        Route::post('warehouses/{warehouse}/restore', [WarehouseController::class, 'restore']);

        // Category Management
        Route::get('categories/all', [CategoryController::class, 'all']);
        Route::get('categories/tree', [CategoryController::class, 'tree']);
        Route::apiResource('categories', CategoryController::class);
        Route::post('categories/{category}/restore', [CategoryController::class, 'restore']);

        // Unit Management
        Route::get('units/all', [UnitController::class, 'all']);
        Route::apiResource('units', UnitController::class);
        Route::post('units/{unit}/restore', [UnitController::class, 'restore']);

        // Supplier Management
        Route::apiResource('suppliers', SupplierController::class);
        Route::post('suppliers/{supplier}/restore', [SupplierController::class, 'restore']);

        // Product Management
        Route::apiResource('products', ProductController::class);
        Route::post('products/{product}/restore', [ProductController::class, 'restore']);
    });

    // Warehouse routes
    Route::prefix('warehouse')->middleware('role:warehouse|admin')->group(function () {
        Route::get('/products', fn () => response()->json(['message' => 'Warehouse products index']));
        Route::get('/categories', fn () => response()->json(['message' => 'Warehouse categories index']));
        Route::get('/suppliers', fn () => response()->json(['message' => 'Warehouse suppliers index']));
    });

    // Inventory routes
    Route::prefix('inventory')->middleware('role:inventory|admin')->group(function () {
        Route::get('/products', fn () => response()->json(['message' => 'Inventory products index']));
        Route::get('/categories', fn () => response()->json(['message' => 'Inventory categories index']));
        Route::get('/units', fn () => response()->json(['message' => 'Inventory units index']));
        Route::get('/customers', fn () => response()->json(['message' => 'Inventory customers index']));
        Route::get('/suppliers', fn () => response()->json(['message' => 'Inventory suppliers index']));
    });
});

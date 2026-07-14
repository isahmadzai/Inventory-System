<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreWarehouseRequest;
use App\Http\Requests\Admin\UpdateWarehouseRequest;
use App\Http\Resources\WarehouseResource;
use App\Services\WarehouseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WarehouseController extends BaseController
{
    public function __construct(
        protected WarehouseService $warehouseService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'country', 'city']);
        $perPage = $request->input('per_page', 15);
        $warehouses = $this->warehouseService->getAll($filters, $perPage);
        return $this->successResponse(WarehouseResource::collection($warehouses), 'Warehouses retrieved successfully');
    }

    public function store(StoreWarehouseRequest $request): JsonResponse
    {
        $warehouse = $this->warehouseService->create($request->validated(), $request);
        return $this->successResponse(new WarehouseResource($warehouse), 'Warehouse created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $warehouse = $this->warehouseService->find($id);
        if (!$warehouse) {
            return $this->errorResponse('Warehouse not found', 404);
        }
        $warehouse->load(['creator', 'updater', 'products']);
        return $this->successResponse(new WarehouseResource($warehouse), 'Warehouse retrieved successfully');
    }

    public function update(UpdateWarehouseRequest $request, int $id): JsonResponse
    {
        $warehouse = $this->warehouseService->update($id, $request->validated(), $request);
        if (!$warehouse) {
            return $this->errorResponse('Warehouse not found', 404);
        }
        return $this->successResponse(new WarehouseResource($warehouse), 'Warehouse updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->warehouseService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Warehouse not found', 404);
        }
        return $this->successResponse(null, 'Warehouse deleted successfully');
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        $warehouse = $this->warehouseService->restore($id, $request);
        if (!$warehouse) {
            return $this->errorResponse('Warehouse not found', 404);
        }
        return $this->successResponse(new WarehouseResource($warehouse), 'Warehouse restored successfully');
    }

    public function filters(): JsonResponse
    {
        $countries = $this->warehouseService->getDistinctCountries();
        $cities = $this->warehouseService->getDistinctCities();
        return $this->successResponse(['countries' => $countries, 'cities' => $cities], 'Filters retrieved successfully');
    }
}

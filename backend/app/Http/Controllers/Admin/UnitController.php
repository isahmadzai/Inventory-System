<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreUnitRequest;
use App\Http\Requests\Admin\UpdateUnitRequest;
use App\Http\Resources\UnitResource;
use App\Services\UnitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnitController extends BaseController
{
    public function __construct(
        protected UnitService $unitService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status']);
        $perPage = $request->input('per_page', 15);
        $units = $this->unitService->getPaginated($filters, $perPage);
        return $this->successResponse(UnitResource::collection($units), 'Units retrieved successfully');
    }

    public function store(StoreUnitRequest $request): JsonResponse
    {
        $unit = $this->unitService->create($request->validated(), $request);
        return $this->successResponse(new UnitResource($unit), 'Unit created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $unit = $this->unitService->find($id);
        if (!$unit) {
            return $this->errorResponse('Unit not found', 404);
        }
        $unit->load('products');
        return $this->successResponse(new UnitResource($unit), 'Unit retrieved successfully');
    }

    public function update(UpdateUnitRequest $request, int $id): JsonResponse
    {
        $unit = $this->unitService->update($id, $request->validated(), $request);
        if (!$unit) {
            return $this->errorResponse('Unit not found', 404);
        }
        return $this->successResponse(new UnitResource($unit), 'Unit updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->unitService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Unit not found', 404);
        }
        return $this->successResponse(null, 'Unit deleted successfully');
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        $unit = $this->unitService->restore($id, $request);
        if (!$unit) {
            return $this->errorResponse('Unit not found', 404);
        }
        return $this->successResponse(new UnitResource($unit), 'Unit restored successfully');
    }

    public function all(): JsonResponse
    {
        $units = $this->unitService->getAll();
        return $this->successResponse(UnitResource::collection($units), 'Units retrieved successfully');
    }
}

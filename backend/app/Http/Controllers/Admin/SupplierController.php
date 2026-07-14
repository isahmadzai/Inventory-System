<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreSupplierRequest;
use App\Http\Requests\Admin\UpdateSupplierRequest;
use App\Http\Resources\SupplierResource;
use App\Services\SupplierService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends BaseController
{
    public function __construct(
        protected SupplierService $supplierService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status']);
        $perPage = $request->input('per_page', 15);
        $suppliers = $this->supplierService->getPaginated($filters, $perPage);
        return $this->successResponse(SupplierResource::collection($suppliers), 'Suppliers retrieved successfully');
    }

    public function store(StoreSupplierRequest $request): JsonResponse
    {
        $supplier = $this->supplierService->create($request->validated(), $request);
        return $this->successResponse(new SupplierResource($supplier), 'Supplier created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $supplier = $this->supplierService->find($id);
        if (!$supplier) {
            return $this->errorResponse('Supplier not found', 404);
        }
        $supplier->load(['products', 'creator', 'updater']);
        return $this->successResponse(new SupplierResource($supplier), 'Supplier retrieved successfully');
    }

    public function update(UpdateSupplierRequest $request, int $id): JsonResponse
    {
        $supplier = $this->supplierService->update($id, $request->validated(), $request);
        if (!$supplier) {
            return $this->errorResponse('Supplier not found', 404);
        }
        return $this->successResponse(new SupplierResource($supplier), 'Supplier updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->supplierService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Supplier not found', 404);
        }
        return $this->successResponse(null, 'Supplier deleted successfully');
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        $supplier = $this->supplierService->restore($id, $request);
        if (!$supplier) {
            return $this->errorResponse('Supplier not found', 404);
        }
        return $this->successResponse(new SupplierResource($supplier), 'Supplier restored successfully');
    }
}

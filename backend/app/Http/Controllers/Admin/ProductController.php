<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends BaseController
{
    public function __construct(
        protected ProductService $productService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status', 'category_id', 'unit_id', 'warehouse_id', 'supplier_id']);
        $perPage = $request->input('per_page', 15);
        $products = $this->productService->getPaginated($filters, $perPage);
        return $this->successResponse(ProductResource::collection($products), 'Products retrieved successfully');
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $data = $request->validated();
        $suppliers = $data['suppliers'] ?? [];
        unset($data['suppliers']);

        $product = $this->productService->create($data, $request);

        if (!empty($suppliers)) {
            $product->suppliers()->sync($suppliers);
        }

        $product->load(['category', 'unit', 'warehouse', 'suppliers']);
        return $this->successResponse(new ProductResource($product), 'Product created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->find($id);
        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }
        $product->load(['category', 'unit', 'warehouse', 'suppliers', 'creator', 'updater', 'inventory']);
        return $this->successResponse(new ProductResource($product), 'Product retrieved successfully');
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $suppliers = $data['suppliers'] ?? null;
        unset($data['suppliers']);

        $product = $this->productService->update($id, $data, $request);
        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }

        if ($suppliers !== null) {
            $product->suppliers()->sync($suppliers);
        }

        $product->load(['category', 'unit', 'warehouse', 'suppliers']);
        return $this->successResponse(new ProductResource($product), 'Product updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->productService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Product not found', 404);
        }
        return $this->successResponse(null, 'Product deleted successfully');
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        $product = $this->productService->restore($id, $request);
        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }
        return $this->successResponse(new ProductResource($product), 'Product restored successfully');
    }
}

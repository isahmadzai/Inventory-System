<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreCategoryRequest;
use App\Http\Requests\Admin\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends BaseController
{
    public function __construct(
        protected CategoryService $categoryService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'status']);
        $perPage = $request->input('per_page', 15);
        $categories = $this->categoryService->getPaginated($filters, $perPage);
        return $this->successResponse(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated(), $request);
        return $this->successResponse(new CategoryResource($category), 'Category created successfully', 201);
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->find($id);
        if (!$category) {
            return $this->errorResponse('Category not found', 404);
        }
        $category->load(['parent', 'children', 'creator', 'products']);
        return $this->successResponse(new CategoryResource($category), 'Category retrieved successfully');
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->update($id, $request->validated(), $request);
        if (!$category) {
            return $this->errorResponse('Category not found', 404);
        }
        return $this->successResponse(new CategoryResource($category), 'Category updated successfully');
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $result = $this->categoryService->delete($id, $request);
        if (!$result) {
            return $this->errorResponse('Category not found', 404);
        }
        return $this->successResponse(null, 'Category deleted successfully');
    }

    public function restore(int $id, Request $request): JsonResponse
    {
        $category = $this->categoryService->restore($id, $request);
        if (!$category) {
            return $this->errorResponse('Category not found', 404);
        }
        return $this->successResponse(new CategoryResource($category), 'Category restored successfully');
    }

    public function tree(): JsonResponse
    {
        $tree = $this->categoryService->getTree();
        return $this->successResponse(CategoryResource::collection($tree), 'Category tree retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $categories = $this->categoryService->getAll();
        return $this->successResponse(CategoryResource::collection($categories), 'Categories retrieved successfully');
    }
}

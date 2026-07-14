<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository,
        protected ActivityService $activityService
    ) {}

    public function getAll(): Collection
    {
        return $this->categoryRepository->getAll();
    }

    public function getTree(): Collection
    {
        return $this->categoryRepository->getTree();
    }

    public function getAllFlat(): Collection
    {
        return $this->categoryRepository->getAllFlat();
    }

    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->categoryRepository->getPaginated($filters, $perPage);
    }

    public function find(int $id): Model
    {
        return $this->categoryRepository->find($id);
    }

    public function create(array $data, Request $request): Model
    {
        $category = $this->categoryRepository->create($data);
        $this->activityService->log('create', 'categories', "Created category: {$category->name}", $request);
        return $category;
    }

    public function update(int $id, array $data, Request $request): Model
    {
        $category = $this->categoryRepository->update($id, $data);
        $this->activityService->log('update', 'categories', "Updated category: {$category->name}", $request);
        return $category;
    }

    public function delete(int $id, Request $request): bool
    {
        $category = $this->categoryRepository->find($id);
        $category->deleted_by = $request->user()?->id;
        $category->save();

        $result = $this->categoryRepository->delete($id);
        $this->activityService->log('delete', 'categories', "Deleted category: {$category->name}", $request);
        return $result;
    }

    public function restore(int $id, Request $request): bool
    {
        $result = $this->categoryRepository->restore($id);
        $this->activityService->log('restore', 'categories', "Restored category ID: {$id}", $request);
        return $result;
    }

    public function getStats(): array
    {
        return $this->categoryRepository->getStats();
    }
}

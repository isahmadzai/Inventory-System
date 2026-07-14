<?php

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ProductService
{
    public function __construct(
        protected ProductRepository $productRepository,
        protected ActivityService $activityService
    ) {}

    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->productRepository->getPaginated($filters, $perPage);
    }

    public function getAll(): Collection
    {
        return $this->productRepository->getAll();
    }

    public function find(int $id): Model
    {
        return $this->productRepository->find($id);
    }

    public function create(array $data, Request $request): Model
    {
        $suppliersData = $data['suppliers'] ?? null;
        unset($data['suppliers']);

        $product = $this->productRepository->create($data);

        if ($suppliersData && is_array($suppliersData)) {
            $product->suppliers()->sync($suppliersData);
        }

        $this->activityService->log('create', 'products', "Created product: {$product->name}", $request);
        return $product;
    }

    public function update(int $id, array $data, Request $request): Model
    {
        $suppliersData = $data['suppliers'] ?? null;
        unset($data['suppliers']);

        $product = $this->productRepository->update($id, $data);

        if (is_array($suppliersData)) {
            $product->suppliers()->sync($suppliersData);
        }

        $this->activityService->log('update', 'products', "Updated product: {$product->name}", $request);
        return $product;
    }

    public function delete(int $id, Request $request): bool
    {
        $product = $this->productRepository->find($id);
        $product->deleted_by = $request->user()?->id;
        $product->save();

        $result = $this->productRepository->delete($id);
        $this->activityService->log('delete', 'products', "Deleted product: {$product->name}", $request);
        return $result;
    }

    public function restore(int $id, Request $request): bool
    {
        $result = $this->productRepository->restore($id);
        $this->activityService->log('restore', 'products', "Restored product ID: {$id}", $request);
        return $result;
    }

    public function getStats(): array
    {
        return $this->productRepository->getStats();
    }
}

<?php

namespace App\Services;

use App\Repositories\SupplierRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class SupplierService
{
    public function __construct(
        protected SupplierRepository $supplierRepository,
        protected ActivityService $activityService
    ) {}

    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->supplierRepository->getPaginated($filters, $perPage);
    }

    public function getAll(): Collection
    {
        return $this->supplierRepository->getAll();
    }

    public function find(int $id): Model
    {
        return $this->supplierRepository->find($id);
    }

    public function create(array $data, Request $request): Model
    {
        $supplier = $this->supplierRepository->create($data);
        $this->activityService->log('create', 'suppliers', "Created supplier: {$supplier->company_name}", $request);
        return $supplier;
    }

    public function update(int $id, array $data, Request $request): Model
    {
        $supplier = $this->supplierRepository->update($id, $data);
        $this->activityService->log('update', 'suppliers', "Updated supplier: {$supplier->company_name}", $request);
        return $supplier;
    }

    public function delete(int $id, Request $request): bool
    {
        $supplier = $this->supplierRepository->find($id);
        $supplier->deleted_by = $request->user()?->id;
        $supplier->save();

        $result = $this->supplierRepository->delete($id);
        $this->activityService->log('delete', 'suppliers', "Deleted supplier: {$supplier->company_name}", $request);
        return $result;
    }

    public function restore(int $id, Request $request): bool
    {
        $result = $this->supplierRepository->restore($id);
        $this->activityService->log('restore', 'suppliers', "Restored supplier ID: {$id}", $request);
        return $result;
    }

    public function getStats(): array
    {
        return $this->supplierRepository->getStats();
    }
}

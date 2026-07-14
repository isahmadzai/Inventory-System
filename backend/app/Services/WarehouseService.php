<?php

namespace App\Services;

use App\Repositories\WarehouseRepository;
use App\Models\Warehouse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WarehouseService
{
    public function __construct(
        protected WarehouseRepository $repository,
        protected ActivityService $activityService,
    ) {}

    public function getAll(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getPaginated($filters, $perPage);
    }

    public function find(int $id): ?Warehouse
    {
        return $this->repository->find($id);
    }

    public function create(array $data, $request = null): Warehouse
    {
        $data['created_by'] = $request?->user()?->id;
        $warehouse = $this->repository->create($data);
        $this->activityService->log('create', 'warehouses', "Created warehouse: {$warehouse->name} ({$warehouse->code})", $request);
        return $warehouse;
    }

    public function update(int $id, array $data, $request = null): ?Warehouse
    {
        $data['updated_by'] = $request?->user()?->id;
        $warehouse = $this->repository->update($id, $data);
        if ($warehouse) {
            $this->activityService->log('update', 'warehouses', "Updated warehouse: {$warehouse->name} ({$warehouse->code})", $request);
        }
        return $warehouse;
    }

    public function delete(int $id, $request = null): bool
    {
        $warehouse = $this->repository->find($id);
        if (!$warehouse) return false;

        $data = ['deleted_by' => $request?->user()?->id];
        $this->repository->update($id, $data);
        $name = $warehouse->name;
        $result = $this->repository->delete($id);
        if ($result) {
            $this->activityService->log('delete', 'warehouses', "Deleted warehouse: {$name}", $request);
        }
        return $result;
    }

    public function restore(int $id, $request = null): ?Warehouse
    {
        $warehouse = $this->repository->restore($id);
        if ($warehouse) {
            $this->activityService->log('restore', 'warehouses', "Restored warehouse: {$warehouse->name} ({$warehouse->code})", $request);
        }
        return $warehouse;
    }

    public function getDistinctCountries(): array
    {
        return $this->repository->getDistinctCountries();
    }

    public function getDistinctCities(): array
    {
        return $this->repository->getDistinctCities();
    }

    public function getStats(): array
    {
        return $this->repository->getStats();
    }
}

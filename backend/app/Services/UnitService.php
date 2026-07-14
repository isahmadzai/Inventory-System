<?php

namespace App\Services;

use App\Repositories\UnitRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class UnitService
{
    public function __construct(
        protected UnitRepository $unitRepository,
        protected ActivityService $activityService
    ) {}

    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return $this->unitRepository->getPaginated($filters, $perPage);
    }

    public function getAll(): Collection
    {
        return $this->unitRepository->getAll();
    }

    public function find(int $id): Model
    {
        return $this->unitRepository->find($id);
    }

    public function create(array $data, Request $request): Model
    {
        $unit = $this->unitRepository->create($data);
        $this->activityService->log('create', 'units', "Created unit: {$unit->name}", $request);
        return $unit;
    }

    public function update(int $id, array $data, Request $request): Model
    {
        $unit = $this->unitRepository->update($id, $data);
        $this->activityService->log('update', 'units', "Updated unit: {$unit->name}", $request);
        return $unit;
    }

    public function delete(int $id, Request $request): bool
    {
        $unit = $this->unitRepository->find($id);
        $unit->deleted_by = $request->user()?->id;
        $unit->save();

        $result = $this->unitRepository->delete($id);
        $this->activityService->log('delete', 'units', "Deleted unit: {$unit->name}", $request);
        return $result;
    }

    public function restore(int $id, Request $request): bool
    {
        $result = $this->unitRepository->restore($id);
        $this->activityService->log('restore', 'units', "Restored unit ID: {$id}", $request);
        return $result;
    }

    public function getStats(): array
    {
        return $this->unitRepository->getStats();
    }
}

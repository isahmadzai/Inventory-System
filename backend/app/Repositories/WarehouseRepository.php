<?php

namespace App\Repositories;

use App\Models\Warehouse;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class WarehouseRepository extends BaseRepository
{
    public function __construct(Warehouse $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['creator', 'updater'])->withTrashed();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['country'])) {
            $query->where('country', $filters['country']);
        }

        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function getDistinctCountries(): array
    {
        return $this->model->whereNotNull('country')
            ->distinct()
            ->pluck('country')
            ->filter()
            ->values()
            ->toArray();
    }

    public function getDistinctCities(): array
    {
        return $this->model->whereNotNull('city')
            ->distinct()
            ->pluck('city')
            ->filter()
            ->values()
            ->toArray();
    }

    public function restore(int $id): ?Warehouse
    {
        $warehouse = $this->model->withTrashed()->find($id);
        if (!$warehouse) return null;
        $warehouse->restore();
        return $warehouse->load(['creator', 'updater']);
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('status', 'active')->count(),
            'inactive' => $this->model->where('status', 'inactive')->count(),
        ];
    }
}

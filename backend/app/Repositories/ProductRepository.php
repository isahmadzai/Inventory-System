<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository extends BaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->withTrashed()->with(['category', 'unit', 'warehouse', 'suppliers']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['unit_id'])) {
            $query->where('unit_id', $filters['unit_id']);
        }

        if (!empty($filters['warehouse_id'])) {
            $query->where('warehouse_id', $filters['warehouse_id']);
        }

        if (!empty($filters['supplier_id'])) {
            $query->whereHas('suppliers', function ($q) use ($filters) {
                $q->where('suppliers.id', $filters['supplier_id']);
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->with(['category', 'unit', 'warehouse', 'suppliers'])->orderBy('name')->get();
    }

    public function restore(int $id): bool
    {
        $model = $this->model->withTrashed()->findOrFail($id);
        return $model->restore();
    }

    public function getStats(): array
    {
        return [
            'total' => $this->model->count(),
            'active' => $this->model->where('status', 'active')->count(),
            'inactive' => $this->model->where('status', 'inactive')->count(),
            'trashed' => $this->model->onlyTrashed()->count(),
        ];
    }
}

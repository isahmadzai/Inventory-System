<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function getPaginated(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->with(['parent', 'creator']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function getAll(): Collection
    {
        return $this->model->with('children')->orderBy('name')->get();
    }

    public function getAllFlat(): Collection
    {
        return $this->model->orderBy('name')->get();
    }

    public function getTree(): Collection
    {
        return $this->model->with('children')
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get();
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
        ];
    }
}

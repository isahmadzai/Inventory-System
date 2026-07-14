<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'warehouse_id',
        'current_quantity',
        'reserved_quantity',
        'minimum_quantity',
        'maximum_quantity',
        'reorder_level',
    ];

    protected function casts(): array
    {
        return [
            'current_quantity' => 'decimal:2',
            'reserved_quantity' => 'decimal:2',
            'minimum_quantity' => 'decimal:2',
            'maximum_quantity' => 'decimal:2',
            'reorder_level' => 'decimal:2',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }
}

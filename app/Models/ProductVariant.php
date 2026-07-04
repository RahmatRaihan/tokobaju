<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['product_id', 'size', 'color', 'sku', 'price', 'stock', 'is_active'])]
class ProductVariant extends Model
{
    protected $appends = ['label', 'is_sold_out'];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Effective price: variant override, or fall back to the product price.
     */
    public function effectivePrice(): int
    {
        return $this->price ?? $this->product->price;
    }

    protected function label(): Attribute
    {
        return Attribute::get(function () {
            $parts = array_filter([$this->size, $this->color]);

            return empty($parts) ? 'Default' : implode(' / ', $parts);
        });
    }

    protected function isSoldOut(): Attribute
    {
        return Attribute::get(fn () => ! $this->is_active || $this->stock <= 0);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

#[Fillable(['name', 'slug', 'description', 'size_chart_path', 'price', 'category_id', 'is_featured', 'is_active'])]
class Product extends Model
{
    protected $appends = ['is_sold_out', 'price_formatted', 'primary_image_url', 'size_chart_url'];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = static::uniqueSlug($product->name);
            }
        });
    }

    protected static function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /**
     * Product is sold out when it has no active variant with stock left.
     */
    protected function isSoldOut(): Attribute
    {
        return Attribute::get(function () {
            $variants = $this->relationLoaded('variants')
                ? $this->variants
                : $this->variants()->get();

            if ($variants->isEmpty()) {
                return true;
            }

            return $variants->where('is_active', true)->where('stock', '>', 0)->isEmpty();
        });
    }

    protected function priceFormatted(): Attribute
    {
        return Attribute::get(fn () => format_rupiah($this->price));
    }

    protected function primaryImageUrl(): Attribute
    {
        return Attribute::get(function () {
            $images = $this->relationLoaded('images') ? $this->images : $this->images()->get();
            $primary = $images->firstWhere('is_primary', true) ?? $images->first();

            return $primary ? image_url($primary->path) : null;
        });
    }

    protected function sizeChartUrl(): Attribute
    {
        return Attribute::get(fn () => image_url($this->size_chart_path));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Catalog: grid + filters (category, availability, price) + search + sort + pagination.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->where('is_active', true)
            ->with(['images', 'variants', 'category'])
            ->withSum(['variants as total_stock' => fn ($q) => $q->where('is_active', true)], 'stock');

        if ($search = $request->string('search')->trim()->value()) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($category = $request->string('category')->trim()->value()) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        // Price range buckets (integer rupiah), matching the original sidebar options.
        $ranges = [
            'under' => [0, 619999],
            'mid' => [620000, 1200000],
            'high' => [1200001, 1800000],
            'veryhigh' => [1800001, PHP_INT_MAX],
        ];
        if ($price = $request->string('price')->value()) {
            if (isset($ranges[$price])) {
                [$min, $max] = $ranges[$price];
                $query->whereBetween('price', [$min, $max]);
            }
        }

        // Availability from aggregated variant stock.
        $availability = $request->string('availability')->value();
        if ($availability === 'instock') {
            $query->having('total_stock', '>', 0);
        } elseif ($availability === 'soldout') {
            $query->where(fn ($q) => $q->having('total_stock', '<=', 0)->orHavingNull('total_stock'));
        }

        // Sorting.
        match ($request->string('sort')->value()) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'az' => $query->orderBy('name'),
            'za' => $query->orderByDesc('name'),
            default => $query->orderByDesc('is_featured')->orderByDesc('created_at'), // Featured
        };

        $products = $query->paginate(9)->withQueryString();

        $products->getCollection()->transform(fn (Product $p) => static::toCard($p));

        return Inertia::render('Catalog', [
            'products' => $products,
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => [
                'search' => $request->string('search')->value() ?: '',
                'category' => $request->string('category')->value() ?: '',
                'availability' => $availability ?: 'all',
                'price' => $price ?: 'all',
                'sort' => $request->string('sort')->value() ?: 'featured',
            ],
        ]);
    }

    /**
     * Lightweight JSON detail for the quick-view modal (variants + images).
     */
    public function quickView(Product $product): \Illuminate\Http\JsonResponse
    {
        abort_unless($product->is_active, 404);

        $product->load(['images', 'variants', 'category']);

        return response()->json(static::toDetail($product));
    }

    /**
     * Product detail page.
     */
    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['images', 'variants', 'category']);

        return Inertia::render('ProductShow', [
            'product' => static::toDetail($product),
            'related' => Product::where('is_active', true)
                ->where('id', '!=', $product->id)
                ->when($product->category_id, fn ($q) => $q->where('category_id', $product->category_id))
                ->with(['images', 'variants'])
                ->take(4)
                ->get()
                ->map(fn (Product $p) => static::toCard($p)),
        ]);
    }

    /**
     * Compact product payload for grids/cards.
     *
     * @return array<string, mixed>
     */
    public static function toCard(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => $product->price,
            'price_formatted' => $product->price_formatted,
            'image' => $product->primary_image_url,
            'is_featured' => $product->is_featured,
            'is_sold_out' => $product->is_sold_out,
            'category' => $product->category?->name,
        ];
    }

    /**
     * Full product payload including variants and images for the detail/quick view.
     *
     * @return array<string, mixed>
     */
    public static function toDetail(Product $product): array
    {
        return [
            ...static::toCard($product),
            'description' => $product->description,
            'size_chart_url' => $product->size_chart_url,
            'images' => $product->images->map(fn ($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'alt' => $img->alt,
                'is_primary' => $img->is_primary,
            ])->values(),
            'variants' => $product->variants->map(fn ($v) => [
                'id' => $v->id,
                'size' => $v->size,
                'color' => $v->color,
                'label' => $v->label,
                'price' => $v->effectivePrice(),
                'price_formatted' => format_rupiah($v->effectivePrice()),
                'stock' => $v->stock,
                'is_sold_out' => $v->is_sold_out,
            ])->values(),
        ];
    }
}

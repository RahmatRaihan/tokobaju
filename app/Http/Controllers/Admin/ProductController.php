<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Support\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with(['category', 'images', 'variants'])
            ->withSum(['variants as total_stock' => fn ($q) => $q->where('is_active', true)], 'stock')
            ->when($request->string('search')->trim()->value(), fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $products->getCollection()->transform(fn (Product $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'price_formatted' => $p->price_formatted,
            'category' => $p->category?->name,
            'image' => $p->primary_image_url,
            'is_featured' => $p->is_featured,
            'is_active' => $p->is_active,
            'is_sold_out' => $p->is_sold_out,
            'total_stock' => (int) $p->total_stock,
        ]);

        return Inertia::render('admin/products/Index', [
            'products' => $products,
            'filters' => ['search' => $request->string('search')->value() ?: ''],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/Form', [
            'product' => null,
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load(['variants', 'images']);

        return Inertia::render('admin/products/Form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'category_id' => $product->category_id,
                'is_featured' => $product->is_featured,
                'is_active' => $product->is_active,
                'variants' => $product->variants->map(fn ($v) => [
                    'id' => $v->id,
                    'size' => $v->size,
                    'color' => $v->color,
                    'sku' => $v->sku,
                    'price' => $v->price,
                    'stock' => $v->stock,
                    'is_active' => $v->is_active,
                ])->values(),
                'images' => $product->images->map(fn ($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'is_primary' => $img->is_primary,
                ])->values(),
                'size_chart_url' => $product->size_chart_url,
            ],
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProduct($request);

        DB::transaction(function () use ($data, $request) {
            $product = Product::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'category_id' => $data['category_id'] ?? null,
                'is_featured' => $data['is_featured'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]);

            $this->syncVariants($product, $data['variants'] ?? []);
            $this->handleImageUploads($product, $request);
            $this->handleSizeChartUpload($product, $request);
        });

        return redirect()->route('admin.products.index')->with('success', 'Product created.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = $this->validateProduct($request);

        DB::transaction(function () use ($data, $request, $product) {
            $product->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'category_id' => $data['category_id'] ?? null,
                'is_featured' => $data['is_featured'] ?? false,
                'is_active' => $data['is_active'] ?? true,
            ]);

            $this->syncVariants($product, $data['variants'] ?? []);
            $this->handleImageUploads($product, $request);
            $this->handleSizeChartUpload($product, $request);
        });

        return redirect()->route('admin.products.index')->with('success', 'Product updated.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        // Remove uploaded (non-external) images from storage.
        foreach ($product->images as $image) {
            $this->deleteStoredImage($image->path);
        }
        $this->deleteStoredImage($product->size_chart_path);

        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted.');
    }

    public function deleteImage(Product $product, ProductImage $image): RedirectResponse
    {
        abort_unless($image->product_id === $product->id, 404);

        $this->deleteStoredImage($image->path);
        $image->delete();

        return back()->with('success', 'Image removed.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateProduct(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'is_featured' => ['boolean'],
            'is_active' => ['boolean'],
            'variants' => ['array'],
            'variants.*.id' => ['nullable', 'integer'],
            'variants.*.size' => ['nullable', 'string', 'max:50'],
            'variants.*.color' => ['nullable', 'string', 'max:50'],
            'variants.*.sku' => ['nullable', 'string', 'max:100'],
            'variants.*.price' => ['nullable', 'integer', 'min:0'],
            'variants.*.stock' => ['required', 'integer', 'min:0'],
            'variants.*.is_active' => ['boolean'],
            'images' => ['array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'primary_image_index' => ['nullable', 'integer'],
            'size_chart' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'remove_size_chart' => ['nullable', 'boolean'],
        ]);
    }

    /**
     * Replace the product's variants with the submitted set.
     * Guarantees at least one (default) variant exists.
     *
     * @param  array<int, array<string, mixed>>  $variants
     */
    private function syncVariants(Product $product, array $variants): void
    {
        if (empty($variants)) {
            // Keep an existing default or create one so stock rules hold.
            if ($product->variants()->count() === 0) {
                $product->variants()->create(['size' => null, 'color' => null, 'stock' => 0]);
            }

            return;
        }

        $keepIds = [];

        foreach ($variants as $v) {
            $payload = [
                'size' => $v['size'] ?? null,
                'color' => $v['color'] ?? null,
                'sku' => $v['sku'] ?? null,
                'price' => $v['price'] ?? null,
                'stock' => $v['stock'] ?? 0,
                'is_active' => $v['is_active'] ?? true,
            ];

            if (! empty($v['id'])) {
                $variant = $product->variants()->find($v['id']);
                if ($variant) {
                    $variant->update($payload);
                    $keepIds[] = $variant->id;

                    continue;
                }
            }

            $created = $product->variants()->create($payload);
            $keepIds[] = $created->id;
        }

        // Delete removed variants.
        $product->variants()->whereNotIn('id', $keepIds)->delete();
    }

    private function handleImageUploads(Product $product, Request $request): void
    {
        if (! $request->hasFile('images')) {
            // Ensure a primary flag exists if any images are present.
            $this->ensurePrimaryImage($product);

            return;
        }

        $primaryIndex = $request->integer('primary_image_index', -1);
        $existingCount = $product->images()->count();

        foreach ($request->file('images') as $i => $file) {
            $path = ImageOptimizer::store($file, 'products');

            $product->images()->create([
                'path' => $path,
                'alt' => $product->name,
                'sort_order' => $existingCount + $i,
                'is_primary' => $primaryIndex === $i && $existingCount === 0,
            ]);
        }

        $this->ensurePrimaryImage($product);
    }

    private function ensurePrimaryImage(Product $product): void
    {
        $product->refresh();
        if ($product->images()->count() > 0 && $product->images()->where('is_primary', true)->count() === 0) {
            $product->images()->orderBy('sort_order')->first()?->update(['is_primary' => true]);
        }
    }

    private function deleteStoredImage(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Upload a new per-product size chart, or remove the existing one.
     */
    private function handleSizeChartUpload(Product $product, Request $request): void
    {
        if ($request->hasFile('size_chart')) {
            $this->deleteStoredImage($product->size_chart_path);
            $path = ImageOptimizer::store($request->file('size_chart'), 'size-charts');
            $product->update(['size_chart_path' => $path]);

            return;
        }

        if ($request->boolean('remove_size_chart')) {
            $this->deleteStoredImage($product->size_chart_path);
            $product->update(['size_chart_path' => null]);
        }
    }
}

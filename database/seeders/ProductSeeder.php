<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id', 'name');

        // Mirrors the original frontend data.ts (prices as integer rupiah).
        $products = [
            [
                'name' => 'FLANNEL - RED',
                'price' => 549000,
                'category' => 'Flannel',
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
                'sizes' => ['S' => 8, 'M' => 12, 'L' => 10, 'XL' => 5],
            ],
            [
                'name' => 'FLANNEL - BLUE',
                'price' => 549000,
                'category' => 'Flannel',
                'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1606820543665-ce32e18579cf?auto=format&fit=crop&q=80&w=800',
                'sizes' => ['S' => 6, 'M' => 9, 'L' => 7, 'XL' => 3],
            ],
            [
                'name' => 'TI SYATS - XIE XIE',
                'price' => 349000,
                'category' => 'Tees',
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
                'sizes' => ['S' => 15, 'M' => 20, 'L' => 18, 'XL' => 10],
            ],
            [
                'name' => 'BOXER - INSKYLXSTR',
                'price' => 199000,
                'category' => 'Boxer',
                'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&q=80&w=800',
                'sizes' => ['M' => 25, 'L' => 22, 'XL' => 14],
            ],
            [
                'name' => 'HOODIE - BLACK',
                'price' => 649000,
                'category' => 'Hoodie',
                'is_featured' => true,
                'image' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
                // Sold out: every variant has zero stock.
                'sizes' => ['S' => 0, 'M' => 0, 'L' => 0, 'XL' => 0],
            ],
            [
                'name' => 'HOODIE - RED',
                'price' => 649000,
                'category' => 'Hoodie',
                'is_featured' => false,
                'image' => 'https://images.unsplash.com/photo-1578587018452-892bace94f74?auto=format&fit=crop&q=80&w=800',
                'sizes' => ['S' => 0, 'M' => 0, 'L' => 0, 'XL' => 0],
            ],
        ];

        foreach ($products as $data) {
            $product = Product::updateOrCreate(
                ['name' => $data['name']],
                [
                    'price' => $data['price'],
                    'category_id' => $categories[$data['category']] ?? null,
                    'is_featured' => $data['is_featured'],
                    'is_active' => true,
                    'description' => 'Premium quality streetwear piece featuring our signature aesthetic. '
                        .'Crafted with attention to detail and designed for maximum comfort and style.',
                ]
            );

            // One variant per size (stock lives on variants).
            foreach ($data['sizes'] as $size => $stock) {
                $product->variants()->updateOrCreate(
                    ['size' => $size, 'color' => null],
                    ['stock' => $stock, 'is_active' => true]
                );
            }

            // Primary image (external URL from the original seed data).
            $product->images()->updateOrCreate(
                ['path' => $data['image']],
                ['is_primary' => true, 'sort_order' => 0, 'alt' => $data['name']]
            );
        }
    }
}

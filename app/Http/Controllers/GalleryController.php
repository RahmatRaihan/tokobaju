<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Gallery', [
            // Order strictly by upload order (id ascending = oldest upload first).
            'images' => GalleryImage::where('is_active', true)
                ->with('product:id,slug,name')
                ->orderBy('id')
                ->get()
                ->map(fn ($g) => [
                    'id' => $g->id,
                    'url' => $g->url,
                    'caption' => $g->caption,
                    'product_slug' => $g->product?->slug,
                    'product_name' => $g->product?->name,
                ]),
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Product::query()
            ->where('is_active', true)
            ->where('is_featured', true)
            ->with(['images', 'variants'])
            ->latest()
            ->take(8)
            ->get()
            ->map(fn (Product $p) => ProductController::toCard($p));

        return Inertia::render('Home', [
            'featured' => $featured,
            'hero' => [
                'image' => image_url(Setting::get('hero_image')),
                'heading' => Setting::get('hero_heading', 'LATEST COLLECTION'),
                'subheading' => Setting::get('hero_subheading'),
            ],
        ]);
    }
}

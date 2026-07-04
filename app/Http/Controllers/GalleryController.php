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
            'images' => GalleryImage::where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn ($g) => [
                    'id' => $g->id,
                    'url' => $g->url,
                    'caption' => $g->caption,
                ]),
        ]);
    }
}

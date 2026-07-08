<?php

namespace App\Http\Controllers;

use App\Models\CommunityPhoto;
use Inertia\Inertia;
use Inertia\Response;

class CommunityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Community', [
            // Order strictly by upload order (id ascending = oldest upload first).
            'photos' => CommunityPhoto::where('is_active', true)
                ->with('product:id,slug,name')
                ->orderBy('id')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'url' => $p->url,
                    'caption' => $p->caption,
                    'product_slug' => $p->product?->slug,
                    'product_name' => $p->product?->name,
                ]),
        ]);
    }
}

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
            'photos' => CommunityPhoto::where('is_active', true)
                ->orderBy('sort_order')
                ->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'url' => $p->url,
                    'caption' => $p->caption,
                ]),
        ]);
    }
}

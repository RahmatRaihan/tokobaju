<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityPhoto;
use App\Support\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommunityPhotoController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // ponytail: array capped at 20 because PHP's max_file_uploads default is 20 —
        // a higher cap here would silently drop the extras. Raise both together.
        $data = $request->validate([
            'images' => ['required', 'array', 'max:20'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'caption' => ['nullable', 'string', 'max:255'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ]);

        $sort = CommunityPhoto::max('sort_order') ?? 0;

        // One product per batch — the whole selection is assumed to be the same look.
        foreach ($data['images'] as $file) {
            CommunityPhoto::create([
                'product_id' => $data['product_id'] ?? null,
                'image_path' => ImageOptimizer::store($file, 'community'),
                'caption' => $data['caption'] ?? null,
                'sort_order' => ++$sort,
                'is_active' => true,
            ]);
        }

        $n = count($data['images']);

        return back()->with('success', $n === 1 ? 'Community photo added.' : "{$n} community photos added.");
    }

    public function destroy(CommunityPhoto $communityPhoto): RedirectResponse
    {
        if (! str_starts_with($communityPhoto->image_path, 'http')) {
            Storage::disk('public')->delete($communityPhoto->image_path);
        }

        $communityPhoto->delete();

        return back()->with('success', 'Community photo removed.');
    }
}

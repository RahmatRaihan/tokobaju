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
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'caption' => ['nullable', 'string', 'max:255'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ]);

        $path = ImageOptimizer::store($data['image'], 'community');

        CommunityPhoto::create([
            'product_id' => $data['product_id'] ?? null,
            'image_path' => $path,
            'caption' => $data['caption'] ?? null,
            'sort_order' => (CommunityPhoto::max('sort_order') ?? 0) + 1,
            'is_active' => true,
        ]);

        return back()->with('success', 'Community photo added.');
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

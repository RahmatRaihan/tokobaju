<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Support\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryImageController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $path = ImageOptimizer::store($data['image'], 'gallery');

        GalleryImage::create([
            'image_path' => $path,
            'caption' => $data['caption'] ?? null,
            'sort_order' => (GalleryImage::max('sort_order') ?? 0) + 1,
            'is_active' => true,
        ]);

        return back()->with('success', 'Gallery image added.');
    }

    public function destroy(GalleryImage $galleryImage): RedirectResponse
    {
        if (! str_starts_with($galleryImage->image_path, 'http')) {
            Storage::disk('public')->delete($galleryImage->image_path);
        }

        $galleryImage->delete();

        return back()->with('success', 'Gallery image removed.');
    }
}

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
        // ponytail: array capped at 20 because PHP's max_file_uploads default is 20 —
        // a higher cap here would silently drop the extras. Raise both together.
        $data = $request->validate([
            'images' => ['required', 'array', 'max:20'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'caption' => ['nullable', 'string', 'max:255'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
        ]);

        $sort = GalleryImage::max('sort_order') ?? 0;

        // One product per batch — the whole selection is assumed to be the same look.
        foreach ($data['images'] as $file) {
            GalleryImage::create([
                'product_id' => $data['product_id'] ?? null,
                'image_path' => ImageOptimizer::store($file, 'gallery'),
                'caption' => $data['caption'] ?? null,
                'sort_order' => ++$sort,
                'is_active' => true,
            ]);
        }

        $n = count($data['images']);

        return back()->with('success', $n === 1 ? 'Gallery image added.' : "{$n} gallery images added.");
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

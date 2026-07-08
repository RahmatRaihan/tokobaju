<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommunityPhoto;
use App\Models\GalleryImage;
use App\Models\Product;
use App\Models\Setting;
use App\Support\ImageOptimizer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/Settings', [
            'settings' => [
                'store_name' => Setting::get('store_name'),
                'store_email' => Setting::get('store_email'),
                'whatsapp_number' => Setting::get('whatsapp_number'),
                'instagram_url' => Setting::get('instagram_url'),
                'hero_heading' => Setting::get('hero_heading'),
                'hero_subheading' => Setting::get('hero_subheading'),
                'hero_image_url' => image_url(Setting::get('hero_image')),
                'about_text' => Setting::get('about_text'),
                'about_image_url' => image_url(Setting::get('about_image')),
                'about_image_2_url' => image_url(Setting::get('about_image_2')),
            ],
            'community_photos' => CommunityPhoto::with('product:id,name')->orderBy('id')->get()
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'url' => $p->url,
                    'caption' => $p->caption,
                    'product_id' => $p->product_id,
                    'product_name' => $p->product?->name,
                ]),
            'gallery_images' => GalleryImage::orderBy('id')->get()
                ->map(fn ($g) => ['id' => $g->id, 'url' => $g->url, 'caption' => $g->caption]),
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'store_name' => ['nullable', 'string', 'max:255'],
            'store_email' => ['nullable', 'email', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:30'],
            'instagram_url' => ['nullable', 'string', 'max:255'],
            'hero_heading' => ['nullable', 'string', 'max:255'],
            'hero_subheading' => ['nullable', 'string', 'max:500'],
            'about_text' => ['nullable', 'string'],
            'hero_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'about_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'about_image_2' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ]);

        // The storefront renders these uppercase; store them that way so the admin field
        // and the public page always agree (and a hand-crafted POST can't sneak in lowercase).
        $upper = ['hero_heading', 'hero_subheading'];

        foreach (['store_name', 'store_email', 'whatsapp_number', 'instagram_url', 'hero_heading', 'hero_subheading', 'about_text'] as $key) {
            if (array_key_exists($key, $data)) {
                Setting::put($key, in_array($key, $upper, true) ? Str::upper($data[$key] ?? '') : $data[$key]);
            }
        }

        // Normalise WhatsApp number to digits only (wa.me needs 62… without + or leading 0).
        if ($request->filled('whatsapp_number')) {
            $normalized = preg_replace('/\D/', '', $request->string('whatsapp_number')->value());
            if (str_starts_with($normalized, '0')) {
                $normalized = '62'.substr($normalized, 1);
            }
            Setting::put('whatsapp_number', $normalized);
        }

        if ($request->hasFile('hero_image')) {
            $path = ImageOptimizer::store($request->file('hero_image'), 'settings');
            Setting::put('hero_image', $path);
        }

        foreach (['about_image', 'about_image_2'] as $key) {
            if ($request->hasFile($key)) {
                Setting::put($key, ImageOptimizer::store($request->file($key), 'settings'));
            }
        }

        return back()->with('success', 'Settings saved.');
    }
}

<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

if (! function_exists('format_rupiah')) {
    /**
     * Format an integer amount of rupiah as "Rp 549.000".
     */
    function format_rupiah(?int $amount): string
    {
        return 'Rp '.number_format((int) $amount, 0, ',', '.');
    }
}

if (! function_exists('image_url')) {
    /**
     * Resolve a stored image path or an external URL to a usable src.
     * External URLs (http/https) are returned as-is; local paths go through the public disk.
     */
    function image_url(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}

if (! function_exists('setting')) {
    /**
     * Read a site setting by key.
     */
    function setting(string $key, ?string $default = null): ?string
    {
        return Setting::get($key, $default);
    }
}

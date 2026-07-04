<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Resizes and compresses uploaded images (via GD) before storing them,
 * so the site stays light without a visible drop in quality.
 *
 * - Downscales so the longest side is at most MAX_DIMENSION px (aspect kept).
 * - Photos are re-encoded as JPEG (quality 82) on a white background.
 * - Images with transparency (logos, size-chart tables) stay PNG so edges/text
 *   remain crisp and the background isn't filled.
 */
class ImageOptimizer
{
    public const MAX_DIMENSION = 1600;

    private const JPEG_QUALITY = 82;

    private const PNG_COMPRESSION = 8; // 0 (none) .. 9 (max)

    /**
     * Optimize an uploaded image and store it on the public disk.
     *
     * @param  string  $directory  Sub-directory on the public disk (e.g. "products").
     * @return string  Stored path relative to the public disk.
     */
    public static function store(UploadedFile $file, string $directory): string
    {
        // If GD isn't available or the file isn't a raster we can read, fall back
        // to storing the original untouched — never lose the upload.
        $image = self::createFromFile($file);
        if ($image === null) {
            return $file->store($directory, 'public');
        }

        [$image, $width, $height] = self::resizeIfNeeded($image);

        $keepPng = self::hasTransparency($file);
        $extension = $keepPng ? 'png' : 'jpg';
        $filename = trim($directory, '/').'/'.Str::random(40).'.'.$extension;

        // Encode into a buffer, then hand the bytes to the storage disk.
        ob_start();
        if ($keepPng) {
            imagesavealpha($image, true);
            imagepng($image, null, self::PNG_COMPRESSION);
        } else {
            imagejpeg($image, null, self::JPEG_QUALITY);
        }
        $binary = ob_get_clean();
        imagedestroy($image);

        Storage::disk('public')->put($filename, $binary);

        return $filename;
    }

    /**
     * @return \GdImage|null
     */
    private static function createFromFile(UploadedFile $file)
    {
        if (! function_exists('imagecreatetruecolor')) {
            return null;
        }

        $path = $file->getRealPath();
        if (! $path) {
            return null;
        }

        $info = @getimagesize($path);
        if ($info === false) {
            return null;
        }

        // Decoding a raster loads it uncompressed into RAM. Raise the memory
        // limit to fit this specific image (plus the resized copy) so large
        // hero/product photos don't blow the default 128M limit.
        self::ensureMemoryFor($info[0], $info[1]);

        $image = match ($info[2]) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG => @imagecreatefrompng($path),
            IMAGETYPE_GIF => @imagecreatefromgif($path),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : null,
            default => null,
        };

        return $image ?: null;
    }

    /**
     * Ensure PHP has enough memory to decode + resize an image of the given size.
     * Estimates ~4 bytes/pixel for source and destination, plus GD overhead,
     * and bumps memory_limit only upward (never lowers it).
     */
    private static function ensureMemoryFor(int $width, int $height): void
    {
        $pixels = (float) $width * $height;
        // source + resized copy (~4 bytes/px each) with a generous safety factor.
        $needBytes = (int) ($pixels * 4 * 3) + 64 * 1024 * 1024;

        $current = self::bytesFromIni(ini_get('memory_limit'));
        if ($current === -1) {
            return; // already unlimited
        }

        $usage = memory_get_usage(true);
        $target = $usage + $needBytes;

        // Cap so a maliciously huge image can't request absurd memory.
        $cap = 512 * 1024 * 1024;
        $target = min($target, $cap);

        if ($target > $current) {
            @ini_set('memory_limit', (string) $target);
        }
    }

    private static function bytesFromIni(string|false $value): int
    {
        if ($value === false || $value === '' || $value === '-1') {
            return -1;
        }

        $value = trim($value);
        $unit = strtolower($value[strlen($value) - 1]);
        $number = (int) $value;

        return match ($unit) {
            'g' => $number * 1024 * 1024 * 1024,
            'm' => $number * 1024 * 1024,
            'k' => $number * 1024,
            default => (int) $value,
        };
    }

    /**
     * @param  \GdImage  $image
     * @return array{0: \GdImage, 1: int, 2: int}
     */
    private static function resizeIfNeeded($image): array
    {
        $width = imagesx($image);
        $height = imagesy($image);
        $longest = max($width, $height);

        if ($longest <= self::MAX_DIMENSION) {
            return [$image, $width, $height];
        }

        $scale = self::MAX_DIMENSION / $longest;
        $newWidth = (int) round($width * $scale);
        $newHeight = (int) round($height * $scale);

        $resized = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency for PNG/GIF sources.
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
        imagefilledrectangle($resized, 0, 0, $newWidth, $newHeight, $transparent);

        imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
        imagedestroy($image);

        return [$resized, $newWidth, $newHeight];
    }

    /**
     * True when the file is a PNG/GIF that actually uses transparency,
     * so we keep it lossless instead of flattening onto white.
     */
    private static function hasTransparency(UploadedFile $file): bool
    {
        $info = @getimagesize($file->getRealPath());
        if ($info === false) {
            return false;
        }

        if ($info[2] === IMAGETYPE_GIF) {
            return true;
        }

        if ($info[2] !== IMAGETYPE_PNG) {
            return false;
        }

        // PNG colour type 4 (gray+alpha) or 6 (RGBA) carries an alpha channel.
        $contents = @file_get_contents($file->getRealPath(), false, null, 25, 1);

        return $contents !== false && in_array(ord($contents), [4, 6], true);
    }
}

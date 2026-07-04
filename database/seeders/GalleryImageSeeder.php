<?php

namespace Database\Seeders;

use App\Models\GalleryImage;
use Illuminate\Database\Seeder;

class GalleryImageSeeder extends Seeder
{
    public function run(): void
    {
        $urls = [
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1485230895905-a593d48e8ff5?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1509631179647-0c37cb50228d?auto=format&fit=crop&q=80&w=800',
        ];

        foreach ($urls as $i => $url) {
            GalleryImage::updateOrCreate(
                ['image_path' => $url],
                ['sort_order' => $i, 'is_active' => true]
            );
        }
    }
}

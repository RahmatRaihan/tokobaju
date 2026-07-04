<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'store_name' => 'INSKYLXSTR',
            'store_email' => 'info@inskylxstr.com',
            'whatsapp_number' => '6281234567890',
            'instagram_url' => 'https://instagram.com/inskylxstr',
            'hero_image' => 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=2000',
            'hero_heading' => 'LATEST COLLECTION',
            'hero_subheading' => 'Bridging contemporary street culture and timeless design.',
            'about_text' => "INSKYLXSTR was born from a desire to bridge the gap between contemporary street culture and timeless design aesthetics. We believe that clothing is more than just fabric—it's a canvas for self-expression, a statement of identity, and a reflection of the modern lifestyle.\n\n"
                ."Founded in Jakarta, our brand draws inspiration from the dynamic energy of urban environments, youth culture, and architectural brutalism. Every piece in our collection is meticulously crafted with an unwavering commitment to quality, comfort, and distinctive style.\n\n"
                .'We are not just a clothing brand; we are a community of creatives, thinkers, and innovators who push boundaries and redefine norms. Join us as we continue to elevate everyday wear into wearable art.',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}

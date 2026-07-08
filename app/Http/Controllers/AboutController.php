<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('About', [
            'about' => [
                'text' => Setting::get('about_text'),
                'email' => Setting::get('store_email'),
                'image' => image_url(Setting::get('about_image')),
                'image2' => image_url(Setting::get('about_image_2')),
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function help(): Response
    {
        return Inertia::render('pages/Help');
    }

    public function privacy(): Response
    {
        return Inertia::render('pages/Privacy');
    }

    public function terms(): Response
    {
        return Inertia::render('pages/Terms');
    }
}

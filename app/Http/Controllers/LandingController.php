<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PromoBanner;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the Saddle Ranch public landing page with active banners, menu products, and customer testimonials.
     */
    public function index(): Response
    {
        $banners = PromoBanner::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->get();

        $products = Product::where('is_active', true)->get();

        $ratings = Rating::where('is_featured', true)
            ->orderBy('id', 'desc')
            ->take(12)
            ->get();

        return Inertia::render('Landing', [
            'banners' => $banners,
            'products' => $products,
            'ratings' => $ratings,
        ]);
    }
}

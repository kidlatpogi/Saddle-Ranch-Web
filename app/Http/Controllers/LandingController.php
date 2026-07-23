<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\PromoBanner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the Saddle Ranch public landing page with active banners and menu products.
     */
    public function index(): Response
    {
        $banners = PromoBanner::where('is_active', true)
            ->orderBy('display_order', 'asc')
            ->get();

        $products = Product::where('is_active', true)->get();

        return Inertia::render('Landing', [
            'banners' => $banners,
            'products' => $products,
        ]);
    }
}

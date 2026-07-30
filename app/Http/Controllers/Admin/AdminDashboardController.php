<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the main Admin Dashboard page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard');
    }
}

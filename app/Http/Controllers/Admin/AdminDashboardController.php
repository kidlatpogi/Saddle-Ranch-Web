<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the main Admin Dashboard page.
     */
    public function index(): Response
    {
        $orders = Order::with('orderItems.product')->orderBy('created_at', 'desc')->get();
        $auditLogs = AuditLog::with('user')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Dashboard', [
            'initialOrders' => $orders,
            'initialAuditLogs' => $auditLogs,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
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
        $products = Product::orderBy('id', 'asc')->get();
        $auditLogs = AuditLog::with('user')->orderBy('created_at', 'desc')->get();
        $employees = \App\Models\User::whereIn('role', ['admin', 'employee', 'cashier', 'kitchen'])->orderBy('id', 'asc')->get();

        return Inertia::render('Admin/Dashboard', [
            'initialOrders' => $orders,
            'initialProducts' => $products,
            'initialAuditLogs' => $auditLogs,
            'initialEmployees' => $employees,
        ]);
    }
}

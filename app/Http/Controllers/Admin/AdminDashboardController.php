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
        $vouchers = \App\Models\Voucher::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Dashboard', [
            'initialOrders' => $orders,
            'initialProducts' => $products,
            'initialAuditLogs' => $auditLogs,
            'initialEmployees' => $employees,
            'initialVouchers' => $vouchers,
        ]);
    }

    /**
     * Delete an order permanently from the database.
     */
    public function destroyOrder(string|int $id)
    {
        $order = Order::where('id', $id)->orWhere('order_number', $id)->firstOrFail();
        $orderNum = $order->order_number;

        \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
            $order->orderItems()->delete();
            $order->delete();
        });

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Permanently Deleted Order #{$orderNum}",
            'ip_address' => request()->ip(),
            'payload' => ['order_number' => $orderNum],
        ]);

        if (request()->wantsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => "Order #{$orderNum} deleted successfully.",
            ]);
        }

        return back()->with('success', "Order #{$orderNum} deleted successfully.");
    }
}

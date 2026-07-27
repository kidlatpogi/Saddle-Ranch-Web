<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SalesAnalyticsController extends Controller
{
    public function index(): Response
    {
        $totalOrdersCount = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $cancelledRevenue = Order::where('status', 'cancelled')->sum('total_amount');

        $avgOrderValue = $totalOrdersCount > 0 ? ($totalRevenue / $totalOrdersCount) : 0;

        // Breakdown by fulfillment type
        $fulfillmentBreakdown = Order::select('order_type', DB::raw('COUNT(*) as total_orders'), DB::raw('SUM(total_amount) as total_revenue'))
            ->groupBy('order_type')
            ->get();

        // Top Selling Products
        $topSellingProducts = OrderItem::select('products.name as product_name', DB::raw('SUM(order_items.quantity) as total_qty'), DB::raw('SUM(order_items.subtotal) as total_sales'))
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->groupBy('products.name')
            ->orderBy('total_qty', 'desc')
            ->take(5)
            ->get();

        // Revenue trend data (grouped by date)
        $dailyTrends = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_amount) as revenue'))
            ->where('status', 'completed')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->take(14)
            ->get();

        return Inertia::render('Admin/Sales', [
            'metrics' => [
                'totalRevenue' => round($totalRevenue, 2),
                'cancelledRevenue' => round($cancelledRevenue, 2),
                'totalOrders' => $totalOrdersCount,
                'avgOrderValue' => round($avgOrderValue, 2),
            ],
            'fulfillmentBreakdown' => $fulfillmentBreakdown,
            'topSellingProducts' => $topSellingProducts,
            'dailyTrends' => $dailyTrends,
        ]);
    }
}

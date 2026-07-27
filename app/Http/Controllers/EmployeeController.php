<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Render Employee POS & Orders Queue Dashboard.
     */
    public function dashboard(): Response
    {
        $orders = Order::with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Employee/Dashboard', [
            'initialOrders' => $orders,
        ]);
    }

    /**
     * Render Kitchen Display System (KDS).
     */
    public function kitchen(): Response
    {
        return Inertia::render('Employee/KDS');
    }

    /**
     * API Endpoint: GET /api/v1/kitchen/orders
     * Fetch active orders (pending, preparing, ready) sorted by created_at ASC with summary aggregator.
     */
    public function getKitchenOrders(): JsonResponse
    {
        $orders = Order::with('orderItems.product')
            ->whereIn('status', ['pending', 'preparing', 'ready'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Cook summary aggregator: calculate total quantities per active product in pending or preparing status
        $summary = OrderItem::whereHas('order', function ($query) {
                $query->whereIn('status', ['pending', 'preparing']);
            })
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select('products.name as product_name', DB::raw('SUM(order_items.quantity) as total_quantity'))
            ->groupBy('products.name')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders,
            'summary' => $summary,
        ]);
    }

    /**
     * Endpoint: PATCH /orders/{id}/status
     * Enforces valid state transitions: pending -> preparing -> ready -> completed
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $newStatus = $validated['status'];
        $currentStatus = $order->status;

        if ($newStatus === 'cancelled') {
            return response()->json([
                'message' => 'Cancellation requires password verification via POST /orders/{id}/cancel',
            ], 403);
        }

        // Validate state transitions
        $allowedTransitions = [
            'pending' => ['preparing'],
            'preparing' => ['ready'],
            'ready' => ['completed'],
        ];

        if (!isset($allowedTransitions[$currentStatus]) || !in_array($newStatus, $allowedTransitions[$currentStatus])) {
            return response()->json([
                'message' => "Invalid status transition from '{$currentStatus}' to '{$newStatus}'.",
            ], 422);
        }

        $order->status = $newStatus;
        $order->save();

        // Audit Log entry
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Updated Order #{$order->order_number} status from {$currentStatus} to {$newStatus}",
            'ip_address' => $request->ip(),
            'payload' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'previous_status' => $currentStatus,
                'new_status' => $newStatus,
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Order #{$order->order_number} status updated to {$newStatus}.",
            'data' => $order->load('orderItems.product'),
        ]);
    }

    /**
     * Security Endpoint: POST /orders/{id}/cancel
     * Requires password & reason. Restores stock, sets cancelled_by_user_id, and logs audit record.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'password' => 'required|string',
            'reason' => 'required|string|max:255',
        ]);

        $user = auth()->user();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid authorization password',
            ], 403);
        }

        $order = Order::with('orderItems.product')->findOrFail($id);

        if ($order->status === 'cancelled') {
            return response()->json([
                'message' => 'Order is already cancelled.',
            ], 422);
        }

        DB::transaction(function () use ($order, $user, $request) {
            $previousStatus = $order->status;
            $order->status = 'cancelled';
            $order->cancelled_by_user_id = $user->id;
            $order->cancellation_reason = $request->reason;
            $order->save();

            // Restore item quantities back to products.stock_quantity
            foreach ($order->orderItems as $item) {
                if ($item->product) {
                    $item->product->increment('stock_quantity', $item->quantity);
                }
            }

            // Create Audit Log record
            AuditLog::create([
                'user_id' => $user->id,
                'action' => "Voided Order #{$order->order_number} | Reason: {$request->reason}",
                'ip_address' => $request->ip(),
                'payload' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'previous_status' => $previousStatus,
                    'reason' => $request->reason,
                ],
            ]);
        });

        return response()->json([
            'status' => 'success',
            'message' => "Order #{$order->order_number} cancelled successfully and stock restored.",
            'data' => $order->fresh('orderItems.product'),
        ]);
    }
}

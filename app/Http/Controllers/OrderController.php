<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display the Remote Online Ordering page (Pick-Up & Delivery).
     */
    public function order(): Response
    {
        $products = Product::where('is_active', true)->get();

        return Inertia::render('Customer/Order', [
            'products' => $products,
        ]);
    }

    /**
     * Display the In-House QR Table Ordering page.
     */
    public function dineIn(Request $request): Response
    {
        $tableNumber = $request->query('table');
        
        if ($tableNumber) {
            $request->session()->put('table_number', $tableNumber);
        } else {
            $tableNumber = $request->session()->get('table_number', '');
        }

        $products = Product::where('is_active', true)->get();

        return Inertia::render('Customer/DineIn', [
            'products' => $products,
            'tableNumber' => (string) $tableNumber,
        ]);
    }

    /**
     * Process checkout submission for Pick-Up, Delivery, Dine-In, or Express Takeout.
     */
    public function checkout(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'order_type' => 'required|in:dine_in,express_takeout,pickup,delivery',
            'table_number' => 'nullable|required_if:order_type,dine_in,express_takeout|string',
            'customer_name' => 'nullable|required_if:order_type,pickup,delivery|string|max:255',
            'customer_phone' => 'nullable|required_if:order_type,pickup,delivery|string|regex:/^[0-9]{11}$/',
            'delivery_address' => 'nullable|required_if:order_type,delivery|string',
            'delivery_notes' => 'nullable|string',
            'pickup_time' => 'nullable|string',
            'payment_method' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            // Optional inline account creation
            'create_account' => 'nullable|boolean',
            'account_email' => 'nullable|required_if:create_account,true|email|max:255|unique:users,email',
            'account_password' => 'nullable|required_if:create_account,true|string|min:8',
        ], [
            'customer_phone.regex' => 'The mobile number must consist of exactly 11 numeric digits (e.g. 09171234567).',
            'account_email.unique' => 'An account with this email already exists. Please sign in or use a different email.',
        ]);

        $createdOrder = DB::transaction(function () use ($validated, $request) {
            $userId = auth()->id();

            // If guest selected optional account creation at checkout
            if (!$userId && !empty($validated['create_account']) && !empty($validated['account_email']) && !empty($validated['account_password'])) {
                $user = \App\Models\User::create([
                    'name' => $validated['customer_name'] ?? 'Customer',
                    'email' => $validated['account_email'],
                    'password' => Hash::make($validated['account_password']),
                    'phone_number' => $validated['customer_phone'] ?? null,
                    'address' => $validated['delivery_address'] ?? null,
                ]);

                \Illuminate\Support\Facades\Auth::login($user);
                $userId = $user->id;
            } elseif ($userId) {
                // Update authenticated user's address & phone for convenience
                $user = auth()->user();
                if ($user) {
                    if (!empty($validated['delivery_address'])) {
                        $user->address = $validated['delivery_address'];
                    }
                    if (!empty($validated['customer_phone'])) {
                        $user->phone_number = $validated['customer_phone'];
                    }
                    $user->save();
                }
            }

            $totalAmount = 0;
            $orderItemsToCreate = [];

            foreach ($validated['items'] as $itemData) {
                // Lock product row for atomic stock check and decrement
                $product = Product::where('id', $itemData['product_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($product->stock_quantity < $itemData['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["Sorry, '{$product->name}' has insufficient stock (Only {$product->stock_quantity} left)."],
                    ]);
                }

                $subtotal = $product->price * $itemData['quantity'];
                $totalAmount += $subtotal;

                $orderItemsToCreate[] = [
                    'product' => $product,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            // Generate unique order number (e.g. SR-8492)
            $orderNumber = 'SR-' . strtoupper(substr(uniqid(), -4));

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'order_type' => $validated['order_type'],
                'table_number' => $validated['table_number'] ?? null,
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'payment_method' => $validated['payment_method'],
                'customer_name' => $validated['customer_name'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'delivery_address' => $validated['delivery_address'] ?? null,
                'delivery_notes' => isset($validated['pickup_time']) && $validated['pickup_time'] 
                    ? "Requested Pick-Up Time: {$validated['pickup_time']}. " . ($validated['delivery_notes'] ?? '')
                    : ($validated['delivery_notes'] ?? null),
            ]);

            foreach ($orderItemsToCreate as $itemInfo) {
                $order->orderItems()->create([
                    'product_id' => $itemInfo['product']->id,
                    'quantity' => $itemInfo['quantity'],
                    'unit_price' => $itemInfo['unit_price'],
                    'subtotal' => $itemInfo['subtotal'],
                ]);

                // Auto-decrement stock quantity
                $itemInfo['product']->decrement('stock_quantity', $itemInfo['quantity']);
            }

            return $order;
        });

        return back()->with([
            'flash' => [
                'success' => 'Order placed successfully!',
                'order' => $createdOrder->load('orderItems.product'),
            ],
        ]);
    }

    /**
     * Endpoint: PATCH /orders/{id}/status
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        return (new EmployeeController())->updateStatus($request, $id);
    }

    /**
     * Security Endpoint: POST /orders/{id}/cancel
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        return (new EmployeeController())->cancel($request, $id);
    }
}

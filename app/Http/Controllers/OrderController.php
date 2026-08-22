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
    public function order(Request $request): Response
    {
        if ($request->has('order_number') && ($request->has('success') || $request->has('paid'))) {
            Order::where('order_number', $request->query('order_number'))->update(['payment_status' => 'paid']);
        }

        $products = Product::orderBy('id', 'asc')->get();

        return Inertia::render('Customer/Order', [
            'products' => $products,
        ]);
    }

    /**
     * Display the In-House QR Table Ordering page.
     */
    public function dineIn(Request $request): Response
    {
        if ($request->has('order_number') && ($request->has('success') || $request->has('paid'))) {
            Order::where('order_number', $request->query('order_number'))->update(['payment_status' => 'paid']);
        }

        $tableNumber = $request->query('table');
        
        if ($tableNumber) {
            $request->session()->put('table_number', $tableNumber);
        } else {
            $tableNumber = $request->session()->get('table_number', '');
        }

        $products = Product::orderBy('id', 'asc')->get();

        return Inertia::render('Customer/DineIn', [
            'products' => $products,
            'tableNumber' => (string) $tableNumber,
        ]);
    }

    /**
     * Process checkout submission for Pick-Up, Delivery, Dine-In, or Express Takeout.
     */
    public function checkout(Request $request): \Symfony\Component\HttpFoundation\Response
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
            'voucher_code' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            // Optional inline account creation
            'create_account' => 'nullable|boolean',
            'account_email' => 'nullable|required_if:create_account,true|email|max:255|unique:users,email',
            'account_password' => 'nullable|required_if:create_account,true|string|min:8',
        ], [
            'items.*.product_id.exists' => 'One or more items in your cart are invalid or no longer available.',
            'items.required' => 'Your cart is empty. Please add items to your cart.',
            'customer_phone.regex' => 'The mobile number must consist of exactly 11 numeric digits (e.g. 09171234567).',
            'account_email.unique' => 'An account with this email already exists. Please sign in or use a different email.',
        ]);

        // Enforce Delivery Payment Policy: No Cash on Delivery allowed (QRPh / e-Wallets Payment First only)
        if ($validated['order_type'] === 'delivery') {
            $payMethod = strtolower($validated['payment_method']);
            if (str_contains($payMethod, 'cash') || str_contains($payMethod, 'cod')) {
                throw ValidationException::withMessages([
                    'payment_method' => ['Delivery orders require payment first via QRPh / e-Wallets (GCash, Maya, ShopeePay, Cards). Cash on Delivery is not supported.'],
                ]);
            }
        }

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

            $rawSubtotal = 0;
            $orderItemsToCreate = [];

            foreach ($validated['items'] as $itemData) {
                // Lock product row for atomic availability & stock check and decrement
                $product = Product::where('id', $itemData['product_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if (!$product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => ["Sorry, '{$product->name}' is currently unavailable."],
                    ]);
                }

                if ($product->stock_quantity < $itemData['quantity'] || $product->stock_quantity <= 0) {
                    throw ValidationException::withMessages([
                        'items' => ["Sorry, '{$product->name}' is out of stock (Only {$product->stock_quantity} left)."],
                    ]);
                }

                $subtotal = $product->price * $itemData['quantity'];
                $rawSubtotal += $subtotal;

                $orderItemsToCreate[] = [
                    'product' => $product,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            // Voucher Validation & Discount Processing
            $discountAmount = 0.00;
            $appliedVoucherCode = null;
            $voucherModel = null;

            if (!empty($validated['voucher_code'])) {
                if (!$userId) {
                    throw ValidationException::withMessages([
                        'voucher_code' => ['You must be logged in to apply a promo coupon or voucher.'],
                    ]);
                }

                $code = strtoupper(trim($validated['voucher_code']));
                $voucherModel = \App\Models\Voucher::where('code', $code)->first();

                if (!$voucherModel) {
                    throw ValidationException::withMessages([
                        'voucher_code' => ['Invalid promo coupon or voucher code.'],
                    ]);
                }

                $now = now();
                if ($voucherModel->is_limited_time || $voucherModel->starts_at || $voucherModel->expires_at) {
                    if ($voucherModel->starts_at && $now->lessThan($voucherModel->starts_at)) {
                        throw ValidationException::withMessages([
                            'voucher_code' => ['This promo code is not active yet.'],
                        ]);
                    }
                    if ($voucherModel->expires_at && $now->greaterThan($voucherModel->expires_at)) {
                        throw ValidationException::withMessages([
                            'voucher_code' => ['This promo code has expired.'],
                        ]);
                    }
                }

                if ($voucherModel->is_one_time_use) {
                    $alreadyUsed = \App\Models\VoucherUsage::where('voucher_id', $voucherModel->id)
                        ->where('user_id', $userId)
                        ->exists();
                    if ($alreadyUsed) {
                        throw ValidationException::withMessages([
                            'voucher_code' => ['You have already redeemed this 1-time use promo code.'],
                        ]);
                    }
                }

                if ($rawSubtotal < $voucherModel->min_spend) {
                    throw ValidationException::withMessages([
                        'voucher_code' => ["Minimum order amount of ₱{$voucherModel->min_spend} required to use code '{$voucherModel->code}'."],
                    ]);
                }

                if ($voucherModel->discount_type === 'percentage') {
                    $discountAmount = ($rawSubtotal * ($voucherModel->value / 100));
                } else {
                    $discountAmount = min($rawSubtotal, $voucherModel->value);
                }

                $discountAmount = round($discountAmount, 2);
                $appliedVoucherCode = $voucherModel->code;
            }

            $finalTotalAmount = round(max(0, $rawSubtotal - $discountAmount), 2);

            // Generate unique order number (e.g. SR-8492)
            $orderNumber = 'SR-' . strtoupper(substr(uniqid(), -4));

            // Determine initial payment status: Cash orders are immediately processed, QRPh/e-Wallets require payment first
            $isCash = str_contains(strtolower($validated['payment_method']), 'cash');
            $initialPaymentStatus = $isCash ? 'paid' : 'pending';

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'order_type' => $validated['order_type'],
                'table_number' => $validated['table_number'] ?? null,
                'status' => 'pending',
                'total_amount' => $finalTotalAmount,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $initialPaymentStatus,
                'voucher_code' => $appliedVoucherCode,
                'discount_amount' => $discountAmount,
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

            // Record Voucher Usage
            if ($voucherModel && $userId) {
                \App\Models\VoucherUsage::create([
                    'voucher_id' => $voucherModel->id,
                    'user_id' => $userId,
                    'order_id' => $order->id,
                ]);
                $voucherModel->increment('times_used');
            }

            // Create Audit Log record
            $custName = $validated['customer_name'] ?? ($validated['table_number'] ? "Table {$validated['table_number']}" : 'Guest');
            AuditLog::create([
                'user_id' => $userId,
                'action' => "Order #{$order->order_number} placed by {$custName} ({$order->order_type}) - Total: ₱" . number_format($finalTotalAmount, 2),
                'ip_address' => request()->ip(),
                'payload' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'order_type' => $order->order_type,
                    'total_amount' => $finalTotalAmount,
                    'voucher_code' => $appliedVoucherCode,
                ],
            ]);

            return $order;
        });

        $secretKey = env('PAYMONGO_SECRET_KEY');
        $payMethod = strtolower($validated['payment_method']);

        if ($secretKey && (str_contains($payMethod, 'paymongo') || str_contains($payMethod, 'qrph') || str_contains($payMethod, 'wallet') || str_contains($payMethod, 'online') || str_contains($payMethod, 'gcash') || str_contains($payMethod, 'card'))) {
            $lineItems = [];
            foreach ($createdOrder->orderItems as $item) {
                $lineItems[] = [
                    'currency' => 'PHP',
                    'amount' => (int) round($item->unit_price * 100),
                    'description' => $item->product->description ?? $item->product->name,
                    'name' => $item->product->name,
                    'quantity' => (int) $item->quantity,
                ];
            }

            try {
                $referer = $request->header('referer') ?: route('order');
                $response = \Illuminate\Support\Facades\Http::withHeaders([
                    'Authorization' => 'Basic ' . base64_encode($secretKey . ':'),
                    'Content-Type' => 'application/json',
                ])->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'send_email_receipt' => true,
                            'show_description' => true,
                            'show_line_items' => true,
                            'cancel_url' => $referer,
                            'success_url' => $referer . (str_contains($referer, '?') ? '&' : '?') . 'success=1&order_number=' . $createdOrder->order_number,
                            'payment_method_types' => ['qrph', 'gcash', 'paymaya', 'card'],
                            'line_items' => $lineItems,
                            'description' => 'Saddle Ranch Order #' . $createdOrder->order_number,
                            'reference_number' => $createdOrder->order_number,
                        ],
                    ],
                ]);

                if ($response->successful()) {
                    $checkoutUrl = $response->json('data.attributes.checkout_url');
                    if ($checkoutUrl) {
                        return Inertia::location($checkoutUrl);
                    }
                } else {
                    \Illuminate\Support\Facades\Log::error('PayMongo Checkout Session Error: ' . $response->body());
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('PayMongo Request Exception: ' . $e->getMessage());
            }
        }

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

    /**
     * Customer / Webhook Payment Confirmation Endpoint: POST /api/v1/orders/{orderNumber}/confirm-payment
     */
    public function confirmPayment(Request $request, string $orderNumber): JsonResponse
    {
        $order = Order::with('orderItems.product')
            ->where('order_number', $orderNumber)
            ->orWhere('id', $orderNumber)
            ->firstOrFail();

        $order->update([
            'payment_status' => 'paid',
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "QRPh/e-Wallet Payment Confirmed for Order #{$order->order_number} (₱{$order->total_amount})",
            'ip_address' => $request->ip(),
            'payload' => [
                'order_number' => $order->order_number,
                'amount' => $order->total_amount,
                'payment_method' => $order->payment_method,
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Payment for Order #{$order->order_number} confirmed successfully. Order is dispatched to the kitchen!",
            'data' => $order,
        ]);
    }
}

<?php

use App\Http\Controllers\Admin\VoucherController;
use App\Http\Controllers\EmployeeController;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\PromoBanner;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Live KDS Data Endpoint (Polling API & Cook Summary)
    Route::get('/kitchen/orders', [EmployeeController::class, 'getKitchenOrders']);
    Route::patch('/orders/{id}/status', [EmployeeController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [EmployeeController::class, 'cancel']);

    // Voucher Validation for Customer Checkout
    Route::post('/vouchers/validate', [VoucherController::class, 'validateVoucher']);

    // Auth Login for Flutter Mobile App
    Route::post('/auth/login', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid login credentials.',
            ], 401);
        }

        $token = $user->createToken('flutter-mobile-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    });

    // List active products with full absolute image URL formatting
    Route::get('/products', function () {
        $products = Product::where('is_active', true)->get()->map(function ($product) {
            if ($product->image_path && !str_starts_with($product->image_path, 'http')) {
                $product->image_path = url($product->image_path);
            }
            return $product;
        });

        return response()->json([
            'status' => 'success',
            'data' => $products,
        ]);
    });

    // List active promo banners with full absolute image URL formatting
    Route::get('/banners', function () {
        $banners = PromoBanner::where('is_active', true)->orderBy('display_order')->get()->map(function ($banner) {
            if ($banner->image_path && !str_starts_with($banner->image_path, 'http')) {
                $banner->image_path = url($banner->image_path);
            }
            return $banner;
        });

        return response()->json([
            'status' => 'success',
            'data' => $banners,
        ]);
    });

    // Submit mobile order
    Route::post('/orders', function (Request $request) {
        $validated = $request->validate([
            'order_type' => 'required|in:dine_in,express_takeout,pickup,delivery',
            'table_number' => 'nullable|string',
            'payment_method' => 'required|string',
            'customer_name' => 'nullable|string',
            'customer_phone' => 'nullable|string',
            'delivery_address' => 'nullable|string',
            'delivery_notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $totalAmount = 0;
        $orderItemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::findOrFail($item['product_id']);
            $subtotal = $product->price * $item['quantity'];
            $totalAmount += $subtotal;

            $orderItemsData[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'unit_price' => $product->price,
                'subtotal' => $subtotal,
            ];
        }

        $orderNumber = 'SR-' . strtoupper(substr(uniqid(), -4));

        $order = Order::create([
            'order_number' => $orderNumber,
            'order_type' => $validated['order_type'],
            'table_number' => $validated['table_number'] ?? null,
            'status' => 'pending',
            'total_amount' => $totalAmount,
            'payment_method' => $validated['payment_method'],
            'customer_name' => $validated['customer_name'] ?? null,
            'customer_phone' => $validated['customer_phone'] ?? null,
            'delivery_address' => $validated['delivery_address'] ?? null,
            'delivery_notes' => $validated['delivery_notes'] ?? null,
        ]);

        foreach ($orderItemsData as $itemData) {
            $order->orderItems()->create($itemData);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Order created successfully.',
            'data' => $order->load('orderItems.product'),
        ], 201);
    });
});

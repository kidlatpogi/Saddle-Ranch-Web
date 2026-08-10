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
    Route::get('/admin/orders', function () {
        $orders = Order::with('orderItems.product')->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    });
    Route::patch('/orders/{id}/status', [EmployeeController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [EmployeeController::class, 'cancel']);

    // Waiter Call Endpoints for In-House QR Table Service
    Route::post('/waiter-call', function (Request $request) {
        $tableNumber = $request->input('table_number', '05');
        $branch = $request->input('branch', 'Bulihan');

        $calls = \Illuminate\Support\Facades\Cache::get('active_waiter_calls', []);
        $newCall = [
            'id' => time() . '_' . rand(100, 999),
            'table_number' => $tableNumber,
            'branch' => $branch,
            'time' => now()->format('h:i A'),
            'timestamp' => time(),
        ];

        $filtered = array_filter($calls, function ($c) use ($tableNumber) {
            return ($c['table_number'] ?? '') !== $tableNumber && (time() - ($c['timestamp'] ?? 0) < 1800);
        });

        $filtered[] = $newCall;
        \Illuminate\Support\Facades\Cache::put('active_waiter_calls', array_values($filtered), 1800);
        \Illuminate\Support\Facades\Cache::put("waiter_status_{$tableNumber}", [
            'status' => 'pending',
            'updated_at' => time()
        ], 600);

        \App\Models\AuditLog::create([
            'action' => "WAITER CALL: Table #{$tableNumber} requested assistance at {$branch} Branch",
            'ip_address' => $request->ip(),
            'payload' => $newCall,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Waiter call sent for Table #{$tableNumber}",
            'data' => $newCall,
        ]);
    });

    Route::get('/waiter-call/status', function (Request $request) {
        $tableNumber = $request->query('table_number', '05');
        $data = \Illuminate\Support\Facades\Cache::get("waiter_status_{$tableNumber}", ['status' => 'idle', 'updated_at' => 0]);
        if (($data['status'] ?? '') === 'acknowledged' && (time() - ($data['updated_at'] ?? 0)) > 15) {
            $data = ['status' => 'idle', 'updated_at' => time()];
            \Illuminate\Support\Facades\Cache::put("waiter_status_{$tableNumber}", $data, 300);
        }
        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    });

    Route::get('/waiter-calls', function () {
        $calls = \Illuminate\Support\Facades\Cache::get('active_waiter_calls', []);
        $active = array_values(array_filter($calls, function ($c) {
            return (time() - ($c['timestamp'] ?? 0)) < 1800;
        }));
        return response()->json([
            'status' => 'success',
            'data' => $active,
        ]);
    });

    Route::post('/waiter-calls/dismiss', function (Request $request) {
        $tableNumber = $request->input('table_number');
        $calls = \Illuminate\Support\Facades\Cache::get('active_waiter_calls', []);
        $updated = array_values(array_filter($calls, function ($c) use ($tableNumber) {
            return ($c['table_number'] ?? '') !== $tableNumber;
        }));
        \Illuminate\Support\Facades\Cache::put('active_waiter_calls', $updated, 1800);
        \Illuminate\Support\Facades\Cache::put("waiter_status_{$tableNumber}", [
            'status' => 'acknowledged',
            'updated_at' => time()
        ], 300);

        return response()->json(['status' => 'success']);
    });

    // Voucher Validation for Customer Checkout
    Route::post('/vouchers/validate', [VoucherController::class, 'validateVoucher']);

    // Customer Order Lookup / Live Status Tracking Endpoint
    Route::get('/orders/track', function (Request $request) {
        $query = trim($request->query('query', ''));
        $showAll = $request->boolean('all') || strtolower($query) === 'all';
        
        if ($showAll) {
            $orders = Order::with('orderItems.product')
                ->orderBy('created_at', 'desc')
                ->take(30)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $orders,
            ]);
        }

        if (empty($query)) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ]);
        }

        $terms = array_filter(array_map('trim', explode(',', $query)));

        $orders = Order::with('orderItems.product')
            ->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->orWhere('order_number', 'LIKE', "%{$term}%")
                      ->orWhere('customer_phone', 'LIKE', "%{$term}%")
                      ->orWhere('customer_name', 'LIKE', "%{$term}%");
                }
            })
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    });

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

    // Customer Web Checkout Auth (Session Based - Web Middleware Group)
    Route::middleware(['web'])->group(function () {
        Route::post('/customer/login', function (Request $request) {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if (\Illuminate\Support\Facades\Auth::attempt($credentials, true)) {
                $request->session()->regenerate();
                $user = \Illuminate\Support\Facades\Auth::user();

                \App\Models\AuditLog::create([
                    'user_id' => $user->id,
                    'action' => "Customer {$user->name} logged in via Checkout Auth Modal",
                    'ip_address' => $request->ip(),
                    'payload' => ['email' => $user->email],
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Logged in successfully!',
                    'user' => $user,
                ]);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email address or password.',
            ], 401);
        });

        Route::post('/customer/register', function (Request $request) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email',
                'phone_number' => 'nullable|string|regex:/^[0-9]{11}$/',
                'password' => 'required|string|min:8',
            ], [
                'email.unique' => 'An account with this email address already exists. Please sign in.',
                'phone_number.regex' => 'Mobile number must consist of 11 numeric digits.',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => 'user',
            ]);

            \Illuminate\Support\Facades\Auth::login($user, true);
            $request->session()->regenerate();

            \App\Models\AuditLog::create([
                'user_id' => $user->id,
                'action' => "New Customer Account Registered: {$user->email}",
                'ip_address' => $request->ip(),
                'payload' => ['email' => $user->email, 'name' => $user->name],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Account created and logged in successfully!',
                'user' => $user,
            ]);
        });
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

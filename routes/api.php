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
        // Enforce payment policy: QRPh/E-wallet orders appear on Admin Dashboard only once payment is verified/paid
        $orders = Order::with('orderItems.product')
            ->where(function ($q) {
                $q->where('payment_status', 'paid')
                  ->orWhere('payment_method', 'LIKE', '%cash%');
            })
            ->orderBy('created_at', 'desc')
            ->get();
        $products = Product::orderBy('id', 'desc')->get();
        $auditLogs = \App\Models\AuditLog::with('user')->orderBy('id', 'desc')->limit(100)->get();
        $ratings = \App\Models\Rating::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $orders,
            'products' => $products,
            'audit_logs' => $auditLogs,
            'ratings' => $ratings,
        ]);
    });
    Route::patch('/orders/{id}/status', [EmployeeController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [EmployeeController::class, 'cancel']);
    Route::post('/orders/{orderNumber}/confirm-payment', [\App\Http\Controllers\OrderController::class, 'confirmPayment']);

    // Customer Ratings & Reviews Endpoints
    Route::get('/ratings', function (Request $request) {
        $branch = $request->query('branch');
        $query = \App\Models\Rating::where('is_featured', true);
        if ($branch && in_array(strtolower($branch), ['bulihan', 'dasmarinas', 'dasma'])) {
            $branchKeyword = strtolower($branch) === 'bulihan' ? 'Bulihan' : 'Dasmarinas';
            $query->where('branch', 'LIKE', "%{$branchKeyword}%");
        }
        $ratings = $query->orderBy('id', 'desc')->take(20)->get();
        return response()->json([
            'status' => 'success',
            'data' => $ratings,
        ]);
    });

    Route::post('/ratings', function (Request $request) {
        $validated = $request->validate([
            'order_id' => 'nullable|integer',
            'order_number' => 'nullable|string|max:50',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'branch' => 'nullable|string|max:50',
            'overall_rating' => 'required|integer|min:1|max:5',
            'food_quality_rating' => 'required|integer|min:1|max:5',
            'customer_service_rating' => 'required|integer|min:1|max:5',
            'delivery_speed_rating' => 'required|integer|min:1|max:5',
            'packaging_rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'favorite_dish' => 'nullable|string|max:255',
        ]);

        $rating = \App\Models\Rating::create([
            'order_id' => $validated['order_id'] ?? null,
            'order_number' => $validated['order_number'] ?? null,
            'user_id' => auth()->id(),
            'customer_name' => $validated['customer_name'] ?? 'Customer',
            'customer_phone' => $validated['customer_phone'] ?? null,
            'branch' => $validated['branch'] ?? 'Bulihan',
            'overall_rating' => $validated['overall_rating'],
            'food_quality_rating' => $validated['food_quality_rating'],
            'customer_service_rating' => $validated['customer_service_rating'],
            'delivery_speed_rating' => $validated['delivery_speed_rating'],
            'packaging_rating' => $validated['packaging_rating'],
            'comment' => $validated['comment'] ?? null,
            'favorite_dish' => $validated['favorite_dish'] ?? null,
            'is_featured' => true,
        ]);

        \App\Models\AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "New {$validated['overall_rating']}★ Rating submitted by {$rating->customer_name}" . ($rating->order_number ? " for Order #{$rating->order_number}" : ""),
            'ip_address' => $request->ip(),
            'payload' => [
                'rating_id' => $rating->id,
                'overall' => $rating->overall_rating,
                'branch' => $rating->branch,
            ],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Thank you for your feedback! Your rating has been received.',
            'data' => $rating,
        ], 201);
    });

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

    // Customer Web Checkout Auth & Voucher Validation (Session Based - Web Middleware Group)
    Route::middleware(['web'])->group(function () {
        Route::get('/customer/me', function (Request $request) {
            return response()->json([
                'status' => 'success',
                'user' => \Illuminate\Support\Facades\Auth::user(),
            ]);
        });

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
                'password' => 'required|string|min:8|confirmed',
            ], [
                'email.unique' => 'An account with this email address already exists. Please sign in.',
                'phone_number.regex' => 'Mobile number must consist of 11 numeric digits.',
                'password.confirmed' => 'Account password and confirmation password do not match.',
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

        Route::post('/customer/logout', function (Request $request) {
            $user = \Illuminate\Support\Facades\Auth::user();
            if ($user) {
                \App\Models\AuditLog::create([
                    'user_id' => $user->id,
                    'action' => "Customer {$user->name} logged out from web session",
                    'ip_address' => $request->ip(),
                    'payload' => ['email' => $user->email],
                ]);
            }
            \Illuminate\Support\Facades\Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'status' => 'success',
                'message' => 'Logged out successfully!',
            ]);
        });

        // Voucher Validation Endpoint (web session protected)
        Route::post('/vouchers/validate', [VoucherController::class, 'validateVoucher']);

        // Customer Available Vouchers Endpoint
        Route::get('/customer/vouchers', function (Request $request) {
            $user = \Illuminate\Support\Facades\Auth::user();

            $vouchers = \App\Models\Voucher::where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->orderBy('created_at', 'desc')->get();

            $usedVoucherIds = [];
            if ($user) {
                $usedVoucherIds = \App\Models\VoucherUsage::where('user_id', $user->id)
                    ->pluck('voucher_id')
                    ->toArray();
            }

            $mapped = $vouchers->map(function ($v) use ($usedVoucherIds) {
                $isUsed = in_array($v->id, $usedVoucherIds);
                return [
                    'id' => $v->id,
                    'code' => $v->code,
                    'discount_type' => $v->discount_type,
                    'value' => (float) $v->value,
                    'min_spend' => (float) $v->min_spend,
                    'is_one_time_use' => (bool) $v->is_one_time_use,
                    'is_limited_time' => (bool) $v->is_limited_time,
                    'branch' => $v->branch,
                    'starts_at' => $v->starts_at ? $v->starts_at->toIso8601String() : null,
                    'expires_at' => $v->expires_at ? $v->expires_at->toIso8601String() : null,
                    'is_used' => $isUsed,
                ];
            });

            return response()->json([
                'status' => 'success',
                'is_logged_in' => !empty($user),
                'user' => $user,
                'data' => $mapped,
            ]);
        });

        // Customer Purchase History
        Route::get('/customer/orders', function (Request $request) {
            $user = \Illuminate\Support\Facades\Auth::user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
            }

            $orders = Order::with('orderItems.product')
                ->where('user_id', $user->id)
                ->orWhere('customer_name', $user->name)
                ->orWhere(function ($query) use ($user) {
                    if ($user->phone_number) {
                        $query->where('customer_phone', $user->phone_number);
                    }
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $orders,
            ]);
        });

        // Customer Profile Update
        Route::post('/customer/profile/update', function (Request $request) {
            $user = \Illuminate\Support\Facades\Auth::user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:users,email,' . $user->id,
                'phone_number' => 'nullable|string|regex:/^[0-9]{11}$/',
                'password' => 'nullable|string|min:8|confirmed',
            ], [
                'email.unique' => 'This email address is already in use by another account.',
                'phone_number.regex' => 'Mobile number must consist of 11 numeric digits.',
                'password.confirmed' => 'New password and confirmation password do not match.',
            ]);

            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->phone_number = $validated['phone_number'] ?? null;
            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            $user->save();

            \App\Models\AuditLog::create([
                'user_id' => $user->id,
                'action' => "Customer updated profile details ({$user->email})",
                'ip_address' => $request->ip(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully!',
                'user' => $user,
            ]);
        });

        // Customer Account Deletion
        Route::post('/customer/account/delete', function (Request $request) {
            $user = \Illuminate\Support\Facades\Auth::user();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
            }

            $userEmail = $user->email;
            \App\Models\AuditLog::create([
                'user_id' => null,
                'action' => "Customer Account Deleted permanently: {$userEmail}",
                'ip_address' => $request->ip(),
            ]);

            \Illuminate\Support\Facades\Auth::guard('web')->logout();
            $user->delete();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'status' => 'success',
                'message' => 'Account permanently deleted.',
            ]);
        });
    });

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

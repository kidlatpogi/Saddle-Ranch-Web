<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\PromoBanner;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BrowserAndUiClickThroughTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * MODULE 1: LANDING PAGE & CUSTOMER NAVIGATION
     */
    public function test_module_1_landing_page_and_navigation()
    {
        // 1. Header & Navigation GET /
        $response = $this->get('/');
        $response->assertStatus(200);

        // Check product & banner props
        $response->assertInertia(fn ($page) => $page
            ->component('Landing')
            ->has('products')
            ->has('banners')
        );
    }

    /**
     * MODULE 2: REMOTE ONLINE ORDERING (/order)
     */
    public function test_module_2_remote_online_ordering_pickup_and_delivery()
    {
        $orderPage = $this->get('/order');
        $orderPage->assertStatus(200);

        $product = Product::first();

        // Delivery Checkout with Bulihan ₱0.00 fee
        $deliveryResponse = $this->post('/order/checkout', [
            'order_type' => 'delivery',
            'customer_name' => 'Test Customer',
            'customer_phone' => '09171234567',
            'delivery_address' => 'Phase 1 Bulihan',
            'payment_method' => 'GCash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2]
            ]
        ]);

        $deliveryResponse->assertStatus(302); // Redirect back with flash
        $this->assertDatabaseHas('orders', [
            'order_type' => 'delivery',
            'customer_name' => 'Test Customer',
            'delivery_address' => 'Phase 1 Bulihan',
        ]);
    }

    /**
     * MODULE 3: IN-HOUSE QR DINE-IN (/dine-in?table=05)
     */
    public function test_module_3_in_house_qr_dine_in_table_05()
    {
        $dineInPage = $this->get('/dine-in?table=05');
        $dineInPage->assertStatus(200);
        $dineInPage->assertInertia(fn ($page) => $page
            ->component('Customer/DineIn')
            ->where('tableNumber', '05')
        );

        $product = Product::first();

        // Dine-In Checkout with Table 05
        $checkoutResp = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '05',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2]
            ]
        ]);

        $checkoutResp->assertStatus(302);
        $this->assertDatabaseHas('orders', [
            'order_type' => 'dine_in',
            'table_number' => '05',
            'status' => 'pending'
        ]);
    }

    /**
     * MODULE 4: KITCHEN DISPLAY & EMPLOYEE DASHBOARD
     */
    public function test_module_4_kds_guard_actions_and_security_void()
    {
        // 1. Unauthenticated access redirect to login
        $guestKds = $this->get('/employee/kitchen');
        $guestKds->assertStatus(302);
        $guestKds->assertRedirect('/login');

        // 2. Log in as employee
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);

        $employeeKds = $this->get('/employee/kitchen');
        $employeeKds->assertStatus(200);

        // 3. Create test order
        $order = Order::create([
            'order_number' => 'SR-E2E-1',
            'order_type' => 'dine_in',
            'table_number' => '05',
            'status' => 'pending',
            'total_amount' => 360.00,
            'payment_method' => 'Cash',
        ]);

        // Start Cooking
        $startResp = $this->patchJson("/orders/{$order->id}/status", ['status' => 'preparing']);
        $startResp->assertStatus(200);
        $this->assertEquals('preparing', $order->fresh()->status);

        // Bump Ready
        $readyResp = $this->patchJson("/orders/{$order->id}/status", ['status' => 'ready']);
        $readyResp->assertStatus(200);
        $this->assertEquals('ready', $order->fresh()->status);

        // Security Void - Wrong Password (403)
        $wrongPassResp = $this->postJson("/orders/{$order->id}/cancel", [
            'password' => 'wrongpassword',
            'reason' => 'Customer changed mind',
        ]);
        $wrongPassResp->assertStatus(403);
        $wrongPassResp->assertJson(['message' => 'Invalid authorization password']);

        // Security Void - Correct Password (200)
        $correctPassResp = $this->postJson("/orders/{$order->id}/cancel", [
            'password' => 'password',
            'reason' => 'Customer changed mind',
        ]);
        $correctPassResp->assertStatus(200);
        $this->assertEquals('cancelled', $order->fresh()->status);
        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $employee->id,
        ]);
    }

    /**
     * MODULE 5: ADMIN PORTAL & SECURITY AUDIT
     */
    public function test_module_5_admin_security_and_operations()
    {
        // 1. Role Middleware Security Check - Employee on /admin/dashboard => 403 Forbidden
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);
        $forbiddenResp = $this->get('/admin/dashboard');
        $forbiddenResp->assertStatus(403);

        // 2. Admin Operations - Login as Admin
        $admin = User::where('email', 'admin@saddleranch.ph')->first();
        $this->actingAs($admin);

        // All admin subpages
        $adminPages = [
            '/admin/dashboard',
            '/admin/products',
            '/admin/banners',
            '/admin/vouchers',
            '/admin/employees',
            '/admin/sales',
            '/admin/qr-generator',
            '/admin/audit-logs',
        ];

        foreach ($adminPages as $pageUrl) {
            $response = $this->get($pageUrl);
            $response->assertStatus(200);
        }

        // Product CRUD Store
        $createProdResp = $this->post('/admin/products', [
            'name' => 'Sizzling Ribeye Steak',
            'description' => 'Premium seared ribeye',
            'price' => 595.00,
            'stock_quantity' => 20,
            'is_active' => true,
        ]);
        $createProdResp->assertStatus(302);
        $this->assertDatabaseHas('products', ['name' => 'Sizzling Ribeye Steak']);
    }

    /**
     * MODULE 6: POS WALK-IN CASHIER ORDER PERSISTENCE & KDS SYNC
     */
    public function test_pos_walk_in_order_submission_and_kds_propagation()
    {
        $cashier = User::where('email', 'cashier.bulihan@saddleranch.ph')->first() ?? User::where('role', 'employee')->first();
        $this->actingAs($cashier);

        $product = Product::first();
        $initialStock = $product->stock_quantity;

        // Place Walk-In POS Order
        $posResponse = $this->postJson('/api/v1/employee/pos/orders', [
            'order_type' => 'dine_in',
            'table_number' => '03',
            'customer_name' => 'Walk-In Customer Juan',
            'payment_method' => 'Cash (Walk-In POS)',
            'discount_type' => 'NONE',
            'discount_amount' => 0,
            'items' => [
                [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => 2,
                ]
            ],
        ]);

        $posResponse->assertStatus(201);
        $posResponse->assertJsonStructure(['status', 'message', 'data' => ['id', 'order_number', 'total_amount']]);

        // Verify order exists in Database
        $this->assertDatabaseHas('orders', [
            'order_type' => 'dine_in',
            'table_number' => '03',
            'customer_name' => 'Walk-In Customer Juan',
            'payment_status' => 'paid',
        ]);

        // Verify stock was decremented
        $product->refresh();
        $this->assertEquals($initialStock - 2, $product->stock_quantity);

        // Verify order shows up on KDS API endpoint
        $kdsResponse = $this->getJson('/api/v1/kitchen/orders');
        $kdsResponse->assertStatus(200);
        $kdsResponse->assertJsonFragment(['customer_name' => 'Walk-In Customer Juan']);
    }
}

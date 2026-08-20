<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\PromoBanner;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SaddleRanchSystemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed initial data
        $this->seed();
    }

    /**
     * PHASE 1: DB & MODEL INTEGRITY TEST
     */
    public function test_phase_1_database_integrity_and_seeders()
    {
        $this->assertDatabaseHas('users', ['email' => 'admin@saddleranch.ph', 'role' => 'admin']);
        $this->assertDatabaseHas('users', ['email' => 'cashier@saddleranch.ph', 'role' => 'employee']);
        $this->assertDatabaseHas('products', ['name' => 'Sizzling Sisig (w/ Egg)']);
        $this->assertDatabaseHas('vouchers', ['code' => 'SADDLE10']);
        $this->assertDatabaseHas('promo_banners', ['title' => 'Weekend Sizzling Specials']);

        $sisig = Product::where('name', 'Sizzling Sisig (w/ Egg)')->first();
        $this->assertEquals(100.00, $sisig->price_bulihan);
        $this->assertEquals(100.00, $sisig->price_dasmarinas);
        $this->assertEquals(35, $sisig->stock_bulihan);
        $this->assertEquals(25, $sisig->stock_dasmarinas);

        $this->assertDatabaseHas('vouchers', ['code' => 'BULIHANFREE', 'branch' => 'bulihan']);
        $this->assertDatabaseHas('vouchers', ['code' => 'DASMAFEAST', 'branch' => 'dasmarinas']);

        $user = User::where('email', 'admin@saddleranch.ph')->first();
        $this->assertNotNull($user->orders);
        $this->assertNotNull($user->auditLogs);
    }

    /**
     * PHASE 2: CUSTOMER CHECKOUT & QR TABLE CONTEXT
     */
    public function test_phase_2_checkout_and_qr_session()
    {
        $product = Product::where('name', 'Sizzling Sisig (w/ Egg)')->first();
        $initialStock = $product->stock_quantity;

        // Pickup order requires name, phone
        $response = $this->post('/order/checkout', [
            'order_type' => 'pickup',
            'customer_name' => 'Test Guest',
            'customer_phone' => '09171234567',
            'pickup_time' => '12:30 PM',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2]
            ]
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('orders', ['customer_name' => 'Test Guest', 'status' => 'pending']);

        // Stock deduction check
        $this->assertEquals($initialStock - 2, $product->fresh()->stock_quantity);

        // Dine-In QR Table context
        $dineInResponse = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '05',
            'payment_method' => 'GCash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1]
            ]
        ]);

        $dineInResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('orders', ['order_type' => 'dine_in', 'table_number' => '05']);
    }

    /**
     * PHASE 3: KDS & ORDER LIFECYCLE
     */
    public function test_phase_3_kds_and_status_lifecycle()
    {
        $order = Order::create([
            'order_number' => 'SR-TEST-1',
            'order_type' => 'dine_in',
            'table_number' => '02',
            'status' => 'pending',
            'total_amount' => 180.00,
            'payment_method' => 'Cash',
        ]);

        // KDS API polling check
        $kdsResponse = $this->getJson('/api/v1/kitchen/orders');
        $kdsResponse->assertStatus(200);
        $kdsResponse->assertJsonStructure(['status', 'data', 'summary']);

        // State Transition pending -> preparing
        $statusResp = $this->patchJson("/orders/{$order->id}/status", ['status' => 'preparing']);
        $statusResp->assertStatus(200);
        $this->assertEquals('preparing', $order->fresh()->status);

        // Invalid transition pending -> completed direct should be rejected
        $invalidResp = $this->patchJson("/orders/{$order->id}/status", ['status' => 'completed']);
        $invalidResp->assertStatus(422);

        // Password void authorization test
        $employee = User::where('email', 'admin@saddleranch.ph')->first();
        $this->actingAs($employee);

        // Invalid password 403
        $failCancel = $this->postJson("/orders/{$order->id}/cancel", [
            'password' => 'wrongpass',
            'reason' => 'Customer left',
        ]);
        $failCancel->assertStatus(403);

        // Valid password success
        $okCancel = $this->postJson("/orders/{$order->id}/cancel", [
            'password' => 'password',
            'reason' => 'Customer left',
        ]);
        $okCancel->assertStatus(200);
        $this->assertEquals('cancelled', $order->fresh()->status);
        $this->assertDatabaseHas('audit_logs', ['user_id' => $employee->id]);
    }

    /**
     * PHASE 4: ADMIN ROLE ACCESS & VOUCHER VALIDATION
     */
    public function test_phase_4_admin_roles_and_vouchers()
    {
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);

        // Admin accesses /admin/dashboard
        $admin = User::where('email', 'admin@saddleranch.ph')->first();
        $this->actingAs($admin);
        $dashboardResp = $this->get('/admin/dashboard');
        $dashboardResp->assertStatus(200);
        $dashboardResp->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));

        // Non-admin blocked from /admin/*
        $this->actingAs($employee);
        $adminRouteResp = $this->get('/admin/products');
        $adminRouteResp->assertStatus(403);

        // Voucher Validation API
        $voucherResp = $this->postJson('/api/v1/vouchers/validate', [
            'code' => 'SADDLE10',
            'total_amount' => 500.00,
        ]);

        $voucherResp->assertStatus(200);
        $voucherResp->assertJsonStructure(['status', 'discount_amount', 'final_amount']);
    }

    /**
     * PHASE 5: MOBILE REST API & SANCTUM LOGIN
     */
    public function test_phase_5_mobile_api()
    {
        $user = User::create([
            'name' => 'Juan Dela Cruz',
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'testmobile@saddleranch.ph',
            'password' => Hash::make('password123'),
            'phone_number' => '09171234567',
            'role' => 'employee'
        ]);

        $loginResp = $this->postJson('/api/v1/auth/login', [
            'email' => 'testmobile@saddleranch.ph',
            'password' => 'password123',
        ]);

        $loginResp->assertStatus(200);
        $loginResp->assertJsonStructure(['token', 'user']);
        $loginResp->assertJsonPath('user.first_name', 'Juan');
        $loginResp->assertJsonPath('user.last_name', 'Dela Cruz');
        $loginResp->assertJsonPath('user.phone_number', '09171234567');

        $productsResp = $this->getJson('/api/v1/products');
        $productsResp->assertStatus(200);
        $productsResp->assertJsonStructure(['status', 'data']);
    }
}

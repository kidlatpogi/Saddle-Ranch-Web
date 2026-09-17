<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\TableSession;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class MobileAndWebE2EIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Test 1: Table Unlock Request (for both Table 01 and Table 02)
     */
    public function test_table_unlock_request_lifecycle(): void
    {
        Cache::flush();

        // 1. Table 01 requests unlock (Web customer)
        $res1 = $this->postJson('/api/v1/table-unlock-request', [
            'table_number' => '01',
            'branch' => 'Bulihan',
        ]);
        $res1->assertOk();
        $res1->assertJson(['status' => 'success']);

        // 2. Table 02 requests unlock (Mobile customer)
        $res2 = $this->postJson('/api/v1/table-unlock-request', [
            'table_number' => '02',
            'branch' => 'Bulihan',
        ]);
        $res2->assertOk();
        $res2->assertJson(['status' => 'success']);

        // 3. Customer polls status -> should be pending
        $statusRes = $this->getJson('/api/v1/table-unlock-request/status?table_number=01');
        $statusRes->assertOk();
        $this->assertEquals('pending', $statusRes->json('data.status'));

        // 4. Cashier dashboard sees both pending unlock requests
        $queueRes = $this->getJson('/api/v1/table-unlock-requests');
        $queueRes->assertOk();
        $tableList = collect($queueRes->json('data'))->pluck('table_number')->all();
        $this->assertContains('01', $tableList);
        $this->assertContains('02', $tableList);

        // 5. Cashier opens Table 01 -> resolves unlock request for Table 01
        $cashier = User::where('email', 'cashier.bulihan@saddleranch.ph')->first();
        $openRes = $this->actingAs($cashier)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '01',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);
        $openRes->assertOk();
        $this->assertTrue(TableSession::isTableActive('01', 'Bulihan'));

        // 6. Verify Table 01 is resolved from active unlock requests queue
        $queueAfter = $this->getJson('/api/v1/table-unlock-requests')->json('data');
        $this->assertFalse(collect($queueAfter)->contains('table_number', '01'));
        $this->assertTrue(collect($queueAfter)->contains('table_number', '02'));
    }

    /**
     * Test 2: Waiter Calling Lifecycle (Call -> Poll Pending -> Dismiss -> Acknowledged)
     */
    public function test_waiter_calling_lifecycle(): void
    {
        Cache::flush();

        // 1. Table 01 calls waiter
        $callRes = $this->postJson('/api/v1/waiter-call', [
            'table_number' => '01',
            'branch' => 'Bulihan',
        ]);
        $callRes->assertOk();

        // 2. Poll waiter status -> pending
        $pollRes = $this->getJson('/api/v1/waiter-call/status?table_number=01');
        $pollRes->assertOk();
        $this->assertEquals('pending', $pollRes->json('data.status'));

        // 3. Cashier/Staff dismisses waiter call
        $dismissRes = $this->postJson('/api/v1/waiter-calls/dismiss', [
            'table_number' => '01',
        ]);
        $dismissRes->assertOk();

        // 4. Poll status again -> acknowledged
        $pollAfter = $this->getJson('/api/v1/waiter-call/status?table_number=01');
        $pollAfter->assertOk();
        $this->assertEquals('acknowledged', $pollAfter->json('data.status'));
    }

    /**
     * Test 3: Mobile Ordering Flow (Online Pickup & Real-Time Tracking)
     */
    public function test_mobile_ordering_pickup_flow(): void
    {
        $product = Product::first();

        // Mobile submits order payload via POST /api/v1/orders
        $response = $this->postJson('/api/v1/orders', [
            'order_type' => 'pickup',
            'branch' => 'Bulihan',
            'customer_name' => 'Mobile Juan',
            'customer_phone' => '09171234567',
            'pickup_time' => 'ASAP (15-20 mins)',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertStatus(201);
        $orderNumber = $response->json('data.order_number');
        $this->assertNotEmpty($orderNumber);
        $this->assertDatabaseHas('orders', [
            'order_number' => $orderNumber,
            'order_type' => 'pickup',
            'customer_phone' => '09171234567',
        ]);

        // Customer tracks order by phone
        $trackRes = $this->getJson('/api/v1/orders/track?phone=09171234567');
        $trackRes->assertOk();
        $this->assertTrue(collect($trackRes->json('data'))->contains('order_number', $orderNumber));
    }

    /**
     * Test 4: Web Ordering Flow (Vouchers, Calculations & Delivery Restrictions)
     */
    public function test_web_ordering_pickup_with_voucher_and_delivery_rules(): void
    {
        $product = Product::where('price', '>=', 100)->first();

        // 1. Pickup order with voucher SADDLE10
        $user = User::factory()->create(['email' => 'webuser@example.com']);
        $pickupRes = $this->actingAs($user)->post('/order/checkout', [
            'order_type' => 'pickup',
            'branch' => 'Bulihan',
            'customer_name' => 'Web Maria',
            'customer_phone' => '09181234567',
            'payment_method' => 'Cash',
            'voucher_code' => 'SADDLE10',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);
        $pickupRes->assertSessionHasNoErrors();
        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Web Maria',
            'order_type' => 'pickup',
            'voucher_code' => 'SADDLE10',
        ]);

        // 2. Delivery order must reject COD (Payment First policy)
        $codDeliveryRes = $this->post('/order/checkout', [
            'order_type' => 'delivery',
            'branch' => 'Bulihan',
            'customer_name' => 'COD Tester',
            'customer_phone' => '09181234567',
            'delivery_address' => 'Brgy Anahaw II, Silang, Cavite',
            'payment_method' => 'Cash on Delivery',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);
        $codDeliveryRes->assertSessionHasErrors(['payment_method']);
    }

    /**
     * Test 5: In-House QR Ordering (Table 01 for Web, Table 02 for Mobile)
     */
    public function test_qr_ordering_table_1_web_and_table_2_mobile(): void
    {
        $product = Product::first();
        $cashier = User::where('email', 'cashier.bulihan@saddleranch.ph')->first();

        // --- TABLE 01 (WEB) ---
        // 1. Table 01 is closed initially -> Web checkout fails
        TableSession::updateOrCreate(
            ['table_number' => '01', 'branch' => 'Bulihan'],
            ['status' => 'closed', 'expires_at' => now()]
        );
        $webBlocked = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '01',
            'branch' => 'Bulihan',
            'payment_method' => 'Cash',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);
        $webBlocked->assertSessionHasErrors(['table_number']);

        // 2. Cashier opens Table 01 -> Web checkout succeeds
        $this->actingAs($cashier)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '01',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ])->assertOk();

        $webSuccess = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '01',
            'branch' => 'Bulihan',
            'customer_name' => 'Web Table 1 Guest',
            'payment_method' => 'Cash',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);
        $webSuccess->assertSessionHasNoErrors();
        $this->assertDatabaseHas('orders', [
            'order_type' => 'dine_in',
            'table_number' => '01',
            'customer_name' => 'Web Table 1 Guest',
        ]);

        // --- TABLE 02 (MOBILE) ---
        // 3. Table 02 is closed initially -> Mobile API checkout fails with 422
        TableSession::updateOrCreate(
            ['table_number' => '02', 'branch' => 'Bulihan'],
            ['status' => 'closed', 'expires_at' => now()]
        );
        $mobileBlocked = $this->postJson('/api/v1/orders', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'branch' => 'Bulihan',
            'customer_name' => 'Mobile Table 2 Guest',
            'customer_phone' => '09171234567',
            'payment_method' => 'Cash',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);
        $mobileBlocked->assertStatus(422);
        $this->assertStringContainsString('closed or its dining session has expired', $mobileBlocked->json('errors.table_number.0'));

        // 4. Cashier opens Table 02 -> Mobile API checkout succeeds
        $this->actingAs($cashier)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '02',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ])->assertOk();

        $mobileSuccess = $this->postJson('/api/v1/orders', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'branch' => 'Bulihan',
            'customer_name' => 'Mobile Table 2 Guest',
            'customer_phone' => '09171234567',
            'payment_method' => 'Cash',
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);
        $mobileSuccess->assertStatus(201);
        $this->assertDatabaseHas('orders', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'customer_name' => 'Mobile Table 2 Guest',
        ]);
    }

    /**
     * Test 6: PayMongo Payment Confirmation & Real-Time KDS Lifecycle Updates
     */
    public function test_paymongo_payment_confirmation_and_kds_status_lifecycle(): void
    {
        $product = Product::first();

        // 1. Create PayMongo order (pending payment)
        $order = Order::create([
            'order_number' => 'SR-E2E9',
            'order_type' => 'delivery',
            'status' => 'pending',
            'total_amount' => 350.00,
            'payment_method' => 'PayMongo (Card / GCash / Maya)',
            'payment_status' => 'pending',
            'branch' => 'Bulihan',
            'customer_name' => 'PayMongo User',
            'customer_phone' => '09171234567',
            'delivery_address' => 'Silang, Cavite',
        ]);

        // 2. Gateway webhook/redirect confirms payment
        $confirmRes = $this->postJson('/api/v1/orders/SR-E2E9/confirm-payment');
        $confirmRes->assertOk();
        $this->assertEquals('paid', $order->fresh()->payment_status);

        // 3. Kitchen KDS updates status lifecycle: pending -> preparing -> ready -> completed
        $chef = User::where('email', 'kitchen.bulihan@saddleranch.ph')->first();
        
        $this->actingAs($chef)->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'preparing'])->assertOk();
        $this->assertEquals('preparing', $order->fresh()->status);

        $this->actingAs($chef)->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'ready'])->assertOk();
        $this->assertEquals('ready', $order->fresh()->status);

        $this->actingAs($chef)->patchJson("/api/v1/orders/{$order->id}/status", ['status' => 'completed'])->assertOk();
        $this->assertEquals('completed', $order->fresh()->status);
    }

    /**
     * Test 7: Voucher Engine Validation
     */
    public function test_voucher_validation_engine(): void
    {
        $user = User::factory()->create();

        // Valid voucher SADDLE10 with subtotal 250
        $res = $this->actingAs($user)->postJson('/api/v1/vouchers/validate', [
            'code' => 'SADDLE10',
            'subtotal' => 250.00,
            'branch' => 'Bulihan',
        ]);
        $res->assertOk();
        $this->assertEquals(25.00, (float) $res->json('data.discount_amount'));
    }
}

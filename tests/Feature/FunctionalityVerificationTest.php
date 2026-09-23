<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\TableSession;
use App\Models\User;
use App\Models\Voucher;
use App\Models\VoucherUsage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class FunctionalityVerificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    // =========================================================================
    // 1. LOGIN TESTS
    // =========================================================================

    public function test_admin_can_login_with_provided_credentials(): void
    {
        $response = $this->post('/login', [
            'email' => 'admin@saddleranch.ph',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $user = auth()->user();
        $this->assertEquals('admin@saddleranch.ph', $user->email);
        $this->assertEquals('admin', $user->role);
        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_cashier_can_login_with_provided_credentials(): void
    {
        $response = $this->post('/login', [
            'email' => 'cashier@saddleranch.ph',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $user = auth()->user();
        $this->assertEquals('cashier@saddleranch.ph', $user->email);
        $this->assertContains($user->role, ['employee', 'cashier']);
        $response->assertRedirect(route('employee.dashboard'));
    }

    public function test_customer_login_redirects_to_ordering_page(): void
    {
        $customer = User::factory()->create([
            'email' => 'regular.customer@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
        ]);

        $response = $this->post('/login', [
            'email' => 'regular.customer@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($customer);
        $response->assertRedirect(route('order'));
    }

    public function test_login_fails_with_invalid_password(): void
    {
        $response = $this->post('/login', [
            'email' => 'admin@saddleranch.ph',
            'password' => 'wrongpassword',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_api_customer_login(): void
    {
        $customer = User::factory()->create([
            'email' => 'api.customer@example.com',
            'password' => Hash::make('secretpass123'),
            'role' => 'user',
        ]);

        $response = $this->postJson('/api/v1/customer/login', [
            'email' => 'api.customer@example.com',
            'password' => 'secretpass123',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'user' => [
                'email' => 'api.customer@example.com',
            ],
        ]);
    }

    // =========================================================================
    // 2. REGISTER TESTS
    // =========================================================================

    public function test_customer_can_register_via_web_form(): void
    {
        $response = $this->post('/register', [
            'name' => 'Maria Makiling',
            'email' => 'maria.makiling@example.com',
            'phone_number' => '09171112233',
            'address' => '123 Mountain View, Laguna',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $this->assertAuthenticated();
        $user = auth()->user();
        $this->assertEquals('maria.makiling@example.com', $user->email);
        $this->assertEquals('09171112233', $user->phone_number);
        $this->assertEquals('123 Mountain View, Laguna', $user->address);
        $this->assertTrue(Hash::check('SecurePass123!', $user->password));
        $this->assertDatabaseHas('users', ['email' => 'maria.makiling@example.com']);
    }

    public function test_registration_validation_rules(): void
    {
        // Duplicate email
        $response = $this->post('/register', [
            'name' => 'Duplicate Admin',
            'email' => 'admin@saddleranch.ph',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);
        $response->assertSessionHasErrors('email');

        // Mismatched password confirmation
        $response2 = $this->post('/register', [
            'name' => 'Bad Confirmation',
            'email' => 'mismatch@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different_password',
        ]);
        $response2->assertSessionHasErrors('password');
    }

    public function test_api_customer_registration(): void
    {
        $response = $this->postJson('/api/v1/customer/register', [
            'name' => 'Juan Tamad',
            'email' => 'juan.tamad@example.com',
            'phone_number' => '09189998877',
            'address' => 'Barangay Bulihan, Silang, Cavite',
            'password' => 'JuanPassword123',
            'password_confirmation' => 'JuanPassword123',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'juan.tamad@example.com']);
    }

    // =========================================================================
    // 3. VOUCHER TESTS
    // =========================================================================

    public function test_admin_can_manage_vouchers(): void
    {
        $admin = User::where('email', 'admin@saddleranch.ph')->first();

        // 1. Admin accesses voucher page
        $this->actingAs($admin)->get('/admin/vouchers')->assertStatus(200);

        // 2. Admin creates a new 20% discount voucher
        $createResponse = $this->actingAs($admin)->post('/admin/vouchers', [
            'code' => 'SUPERPROMO20',
            'discount_type' => 'percentage',
            'value' => 20,
            'min_spend' => 300,
            'branch' => 'all',
            'is_one_time_use' => 1,
        ]);
        $createResponse->assertSessionHasNoErrors();
        $this->assertDatabaseHas('vouchers', ['code' => 'SUPERPROMO20', 'value' => 20]);

        // 3. Admin deletes the voucher
        $voucher = Voucher::where('code', 'SUPERPROMO20')->first();
        $deleteResponse = $this->actingAs($admin)->delete("/admin/vouchers/{$voucher->id}");
        $deleteResponse->assertSessionHasNoErrors();
        $this->assertDatabaseMissing('vouchers', ['code' => 'SUPERPROMO20']);
    }

    public function test_guest_cannot_apply_voucher(): void
    {
        $response = $this->postJson('/api/v1/vouchers/validate', [
            'code' => 'SADDLE10',
            'total_amount' => 500,
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'status' => 'error',
            'requires_auth' => true,
        ]);
    }

    public function test_authenticated_customer_voucher_validation_rules(): void
    {
        $customer = User::factory()->create();

        // Test 1: Minimum spend failure
        // SADDLE10 requires min_spend = 200
        $responseMin = $this->actingAs($customer)->postJson('/api/v1/vouchers/validate', [
            'code' => 'SADDLE10',
            'total_amount' => 150,
        ]);
        $responseMin->assertStatus(422);

        // Test 2: Valid application (Percentage discount)
        // SADDLE10 is 10% off with min_spend 200
        $responseSuccess = $this->actingAs($customer)->postJson('/api/v1/vouchers/validate', [
            'code' => 'SADDLE10',
            'total_amount' => 500,
        ]);
        $responseSuccess->assertStatus(200);
        $responseSuccess->assertJson([
            'status' => 'success',
            'discount_amount' => 50,
            'final_amount' => 450,
        ]);

        // Test 3: Fixed discount voucher (WELCOME50: fixed 50 off, min 500, one time use)
        $responseFixed = $this->actingAs($customer)->postJson('/api/v1/vouchers/validate', [
            'code' => 'WELCOME50',
            'total_amount' => 600,
        ]);
        $responseFixed->assertStatus(200);
        $responseFixed->assertJson([
            'status' => 'success',
            'discount_amount' => 50,
            'final_amount' => 550,
        ]);
    }

    public function test_one_time_use_voucher_cannot_be_reused(): void
    {
        $customer = User::factory()->create();
        $voucher = Voucher::where('code', 'WELCOME50')->first();

        // Simulate customer already used this voucher
        VoucherUsage::create([
            'voucher_id' => $voucher->id,
            'user_id' => $customer->id,
        ]);

        $response = $this->actingAs($customer)->postJson('/api/v1/vouchers/validate', [
            'code' => 'WELCOME50',
            'total_amount' => 600,
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'status' => 'error',
            'message' => 'You have already redeemed this 1-time use voucher code.',
        ]);
    }

    // =========================================================================
    // 4. ONLINE ORDERING TESTS (PICK-UP & DELIVERY)
    // =========================================================================

    public function test_online_ordering_pickup_flow_with_stock_deduction(): void
    {
        $product = Product::where('stock_quantity', '>', 5)->first();
        $originalStock = $product->stock_quantity;

        $response = $this->post('/order/checkout', [
            'order_type' => 'pickup',
            'customer_name' => 'Elena Cruz',
            'customer_phone' => '09171234567',
            'pickup_time' => '1:00 PM',
            'delivery_notes' => 'Pack condiments separately please',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertSessionHasNoErrors();

        $order = Order::where('customer_name', 'Elena Cruz')->latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals('pickup', $order->order_type);
        $this->assertStringStartsWith('SR-', $order->order_number);
        $this->assertEquals('paid', $order->payment_status); // Cash is instantly marked paid
        $this->assertEquals($originalStock - 2, $product->fresh()->stock_quantity);

        // Audit log created
        $this->assertDatabaseHas('audit_logs', [
            'action' => "Order #{$order->order_number} placed by Elena Cruz (pickup) - Total: ₱" . number_format($order->total_amount, 2),
        ]);
    }

    public function test_online_ordering_delivery_requires_address_and_forbids_cod(): void
    {
        $product = Product::first();

        // 1. Delivery with Cash/COD must be blocked (policy requires payment first via online)
        $responseCod = $this->post('/order/checkout', [
            'order_type' => 'delivery',
            'customer_name' => 'Carlo Santos',
            'customer_phone' => '09191234567',
            'delivery_address' => 'Unit 402, Highrise Tower, Cavite',
            'payment_method' => 'Cash on Delivery',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);
        $responseCod->assertSessionHasErrors('payment_method');

        // 2. Delivery with missing address must be blocked
        $responseNoAddress = $this->post('/order/checkout', [
            'order_type' => 'delivery',
            'customer_name' => 'Carlo Santos',
            'customer_phone' => '09191234567',
            'payment_method' => 'GCash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);
        $responseNoAddress->assertSessionHasErrors('delivery_address');

        // 3. Valid delivery with GCash
        $responseValid = $this->post('/order/checkout', [
            'order_type' => 'delivery',
            'customer_name' => 'Carlo Santos',
            'customer_phone' => '09191234567',
            'delivery_address' => 'Unit 402, Highrise Tower, Cavite',
            'payment_method' => 'GCash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);
        $responseValid->assertSessionHasNoErrors();
        $this->assertDatabaseHas('orders', [
            'customer_name' => 'Carlo Santos',
            'order_type' => 'delivery',
            'delivery_address' => 'Unit 402, Highrise Tower, Cavite',
        ]);
    }

    public function test_online_ordering_with_voucher_applies_discount_and_records_usage(): void
    {
        $customer = User::factory()->create([
            'email' => 'order.voucher.user@example.com',
        ]);

        $product = Product::first(); // Price >= 50
        // Purchase 5 units to ensure subtotal >= 200 (SADDLE10 min spend)
        $itemQty = 5;
        $expectedSubtotal = $product->price * $itemQty;
        $expectedDiscount = round($expectedSubtotal * 0.10, 2);
        $expectedFinal = round($expectedSubtotal - $expectedDiscount, 2);

        $response = $this->actingAs($customer)->post('/order/checkout', [
            'order_type' => 'pickup',
            'customer_name' => 'Voucher Customer',
            'customer_phone' => '09170001122',
            'pickup_time' => '2:00 PM',
            'payment_method' => 'Cash',
            'voucher_code' => 'SADDLE10',
            'items' => [
                ['product_id' => $product->id, 'quantity' => $itemQty],
            ],
        ]);

        $response->assertSessionHasNoErrors();

        $order = Order::where('customer_name', 'Voucher Customer')->latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals('SADDLE10', $order->voucher_code);
        $this->assertEquals($expectedDiscount, $order->discount_amount);
        $this->assertEquals($expectedFinal, $order->total_amount);

        // Voucher usage recorded
        $this->assertDatabaseHas('voucher_usages', [
            'user_id' => $customer->id,
            'order_id' => $order->id,
        ]);
    }

    public function test_insufficient_stock_prevents_order_creation(): void
    {
        $product = Product::first();
        $product->update(['stock_quantity' => 2]);

        $response = $this->post('/order/checkout', [
            'order_type' => 'pickup',
            'customer_name' => 'Greedy Buyer',
            'customer_phone' => '09179998877',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 10],
            ],
        ]);

        $response->assertSessionHasErrors('items');
        $this->assertDatabaseMissing('orders', ['customer_name' => 'Greedy Buyer']);
        $this->assertEquals(2, $product->fresh()->stock_quantity);
    }

    // =========================================================================
    // 5. QR ORDERING TESTS (IN-HOUSE DINE-IN)
    // =========================================================================

    public function test_closed_table_blocks_dine_in_checkout(): void
    {
        // Table 02 is closed by default
        $product = Product::first();

        $response = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertSessionHasErrors('table_number');
        $this->assertDatabaseMissing('orders', ['table_number' => '02']);
    }

    public function test_customer_can_send_table_unlock_request_and_waiter_call(): void
    {
        // Customer sends unlock request for table 02
        $unlockResponse = $this->postJson('/api/v1/table-unlock-request', [
            'table_number' => '02',
            'branch' => 'Bulihan',
        ]);
        $unlockResponse->assertStatus(200);
        $unlockResponse->assertJson(['status' => 'success']);

        // Check unlock request status polling
        $statusPoll = $this->getJson('/api/v1/table-unlock-request/status?table_number=02');
        $statusPoll->assertStatus(200);
        $statusPoll->assertJson(['status' => 'success', 'data' => ['status' => 'pending']]);

        // Customer calls waiter for table 02
        $waiterResponse = $this->postJson('/api/v1/waiter-call', [
            'table_number' => '02',
            'branch' => 'Bulihan',
        ]);
        $waiterResponse->assertStatus(200);
        $waiterResponse->assertJson(['status' => 'success']);
    }

    public function test_staff_opens_table_session_enabling_dine_in_checkout(): void
    {
        $cashier = User::where('email', 'cashier@saddleranch.ph')->first();
        $product = Product::first();
        $initialStock = $product->stock_quantity;

        // 1. Staff opens table 02 session for 60 minutes
        $openResponse = $this->actingAs($cashier)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '02',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);
        $openResponse->assertStatus(200);
        $this->assertTrue(TableSession::isTableActive('02', 'Bulihan'));

        // 2. Customer successfully places Dine-In QR order at table 02
        $checkoutResponse = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'branch' => 'Bulihan',
            'delivery_notes' => 'Please serve with extra utensils',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $checkoutResponse->assertSessionHasNoErrors();

        $order = Order::where('order_type', 'dine_in')->where('table_number', '02')->latest()->first();
        $this->assertNotNull($order);
        $this->assertEquals($initialStock - 2, $product->fresh()->stock_quantity);

        // 3. Check order appears in Kitchen Display System (KDS)
        $kdsResponse = $this->getJson('/api/v1/kitchen/orders');
        $kdsResponse->assertStatus(200);
        $ordersInKds = collect($kdsResponse->json('data'));
        $this->assertTrue($ordersInKds->contains('order_number', $order->order_number));
    }

    public function test_dine_in_page_renders_with_table_session_context(): void
    {
        // Table 05 is default active from seeder
        $response = $this->get('/dine-in?table=05&branch=Bulihan');
        $response->assertStatus(200);
    }
}

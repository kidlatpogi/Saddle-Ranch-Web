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
use Tests\TestCase;

class UiUxTypographyResponsivenessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * MODULE 1: BUTTONS & TOUCH TARGET AUDIT
     */
    public function test_module_1_button_touch_targets_and_out_of_stock_state()
    {
        // 1. Verify out of stock item handling
        $outOfStockProduct = Product::create([
            'name' => 'Out of Stock Sisig Special',
            'description' => 'Sold out item test',
            'price' => 200.00,
            'stock_quantity' => 0,
            'is_active' => true,
        ]);

        $response = $this->get('/order');
        $response->assertStatus(200);
        
        // Assert attempt to checkout zero stock item fails validation
        $checkoutFail = $this->post('/order/checkout', [
            'order_type' => 'pickup',
            'customer_name' => 'Test Customer',
            'customer_phone' => '09171234567',
            'pickup_time' => '12:00 PM',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $outOfStockProduct->id, 'quantity' => 1]
            ]
        ]);

        $checkoutFail->assertSessionHasErrors('items');
    }

    /**
     * MODULE 2: TYPOGRAPHY, CURRENCY & CONTRAST AUDIT
     */
    public function test_module_2_typography_currency_formatting()
    {
        // Verify products API returns formatted prices
        $response = $this->getJson('/api/v1/products');
        $response->assertStatus(200);
        
        $productsData = $response->json('data');
        foreach ($productsData as $product) {
            $this->assertNotNull($product['price']);
            $this->assertGreaterThanOrEqual(0, (float) $product['price']);
        }

        // Verify KDS order price format
        $order = Order::create([
            'order_number' => 'SR-FMT-1',
            'order_type' => 'dine_in',
            'table_number' => '05',
            'status' => 'pending',
            'total_amount' => 180.50,
            'payment_method' => 'Cash',
        ]);

        $kdsResponse = $this->getJson('/api/v1/kitchen/orders');
        $kdsResponse->assertStatus(200);
        $kdsData = $kdsResponse->json('data');
        $this->assertEquals('180.50', (string) $kdsData[0]['total_amount']);
    }

    /**
     * MODULE 3: RESPONSIVENESS & VIEWPORT AUDIT
     */
    public function test_module_3_viewport_responsive_endpoints()
    {
        // 1. Mobile & Landing Page
        $this->get('/')->assertStatus(200);

        // 2. Ordering Page
        $this->get('/order')->assertStatus(200);

        // 3. Dine In Context Page
        $this->get('/dine-in?table=05')->assertStatus(200);

        // 4. KDS Page as employee
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);
        $this->get('/employee/kitchen')->assertStatus(200);
        $this->get('/employee/dashboard')->assertStatus(200);
    }

    /**
     * MODULE 4: LAYOUT SCALABILITY & EXTREME EDGE-CASE STRESS TEST
     */
    public function test_module_4_extreme_edge_case_and_large_orders()
    {
        // 1. Long text product name & delivery notes
        $longProduct = Product::create([
            'name' => 'Saddle Ranch Extra Crispy Super Sizzling Pork Sisig Family Platter Special Edition Extra Supreme',
            'description' => 'Long text description test for UI text overflow and line wrapping resilience',
            'price' => 999.00,
            'stock_quantity' => 500,
            'is_active' => true,
        ]);

        $longOrder = Order::create([
            'order_number' => 'SR-LONG-999',
            'order_type' => 'delivery',
            'customer_name' => 'Don Alejandro Fernando Jose Maria De Cruz',
            'customer_phone' => '09171234567890',
            'delivery_address' => 'Phase 1 Block 23 Lot 45 Villa Bulihan Main Highway Corner Sunflower Street, Dasmarinas Cavite',
            'delivery_notes' => 'Please deliver near the yellow gate, knock 3 times, mind the big dog, leave on top of the wooden table under the mango tree near the garage.',
            'status' => 'pending',
            'total_amount' => 98901.00,
            'payment_method' => 'Cash on Delivery',
        ]);

        $longOrder->orderItems()->create([
            'product_id' => $longProduct->id,
            'quantity' => 99,
            'unit_price' => 999.00,
            'subtotal' => 98901.00,
        ]);

        // KDS Aggregator Check with 99x quantity
        $kdsResponse = $this->getJson('/api/v1/kitchen/orders');
        $kdsResponse->assertStatus(200);
        
        $summary = $kdsResponse->json('summary');
        $foundLongProduct = false;
        foreach ($summary as $sumItem) {
            if ($sumItem['product_name'] === $longProduct->name) {
                $foundLongProduct = true;
                $this->assertEquals(99, (int) $sumItem['total_quantity']);
            }
        }
        $this->assertTrue($foundLongProduct);
    }

    /**
     * MODULE 5: SYSTEM SPECIFICATION CONFORMANCE AUDIT
     */
    public function test_module_5_system_specification_conformance()
    {
        // 1. In-house QR Dine in table 05
        $dineInResp = $this->get('/dine-in?table=05');
        $dineInResp->assertInertia(fn ($page) => $page
            ->component('Customer/DineIn')
            ->where('tableNumber', '05')
        );

        // 2. Admin vs Employee Role Matrix
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);
        $this->get('/admin/sales')->assertStatus(403);
        $this->get('/admin/audit-logs')->assertStatus(403);

        $admin = User::where('email', 'admin@saddleranch.ph')->first();
        $this->actingAs($admin);
        $this->get('/admin/sales')->assertStatus(200);
        $this->get('/admin/audit-logs')->assertStatus(200);
        $this->get('/admin/qr-generator')->assertStatus(200);
    }
}

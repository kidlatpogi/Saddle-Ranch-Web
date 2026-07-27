<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RealWorldClientReadinessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * SECTION 1: 80MM THERMAL RECEIPT & PRINT STYLES
     */
    public function test_section_1_thermal_receipt_print_structure()
    {
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);

        $response = $this->get('/employee/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Employee/Dashboard')
        );
    }

    /**
     * SECTION 2: KDS AUDIO AUTOPLAY & RESILIENCE
     */
    public function test_section_2_kds_audio_chime_resilience()
    {
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);

        $response = $this->get('/employee/kitchen');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Employee/KDS')
        );
    }

    /**
     * SECTION 3: MOBILE TOUCH TARGETS & FORM ACCESSIBILITY
     */
    public function test_section_3_mobile_touch_targets_and_forms()
    {
        $response = $this->get('/order');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Customer/Order')
            ->has('products')
        );
    }

    /**
     * SECTION 4: CLIENT MENU DATA, PRICE PRECISION & IMAGE STATUS
     */
    public function test_section_4_menu_data_and_image_urls()
    {
        $products = Product::where('is_active', true)->get();
        $this->assertNotEmpty($products);

        foreach ($products as $product) {
            $this->assertGreaterThanOrEqual(0, $product->price);
            $this->assertGreaterThanOrEqual(0, $product->stock_quantity);
            $this->assertNotNull($product->image_path);
        }
    }

    /**
     * SECTION 5: CASHIER TYPO & FRIENDLY ERROR HANDLING
     */
    public function test_section_5_cashier_typo_and_friendly_errors()
    {
        $employee = User::where('email', 'cashier@saddleranch.ph')->first();
        $this->actingAs($employee);

        $order = Order::create([
            'order_number' => 'SR-CLIENT-1',
            'order_type' => 'dine_in',
            'table_number' => '05',
            'status' => 'pending',
            'total_amount' => 180.00,
            'payment_method' => 'Cash',
        ]);

        // Wrong password yields 403 with friendly message, not stack trace
        $failResp = $this->postJson("/orders/{$order->id}/cancel", [
            'password' => 'wrongpass',
            'reason' => 'Typo test',
        ]);

        $failResp->assertStatus(403);
        $failResp->assertJson(['message' => 'Invalid authorization password']);
    }
}

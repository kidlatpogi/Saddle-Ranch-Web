<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderCheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_pickup_order_flow(): void
    {
        $product = Product::where('name', 'like', '%Sisig%')->first();
        $initialStock = $product->stock_quantity;

        $response = $this->post('/order/checkout', [
            'order_type' => 'pickup',
            'customer_name' => 'Juan Dela Cruz',
            'customer_phone' => '09171234567',
            'pickup_time' => 'ASAP (15-20 mins)',
            'payment_method' => 'GCash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        
        $order = Order::where('order_type', 'pickup')->latest('id')->first();
        $this->assertNotNull($order);
        $this->assertEquals('Juan Dela Cruz', $order->customer_name);
        $this->assertEquals('09171234567', $order->customer_phone);

        $product->refresh();
        $this->assertEquals($initialStock - 2, $product->stock_quantity);

        $this->assertDatabaseHas('audit_logs', [
            'action' => "Order #{$order->order_number} placed by Juan Dela Cruz (pickup) - Total: ₱" . number_format($order->total_amount, 2),
        ]);
    }

    public function test_delivery_order_flow(): void
    {
        $product = Product::where('name', 'like', '%Chicken Inasal%')->first();
        $initialStock = $product->stock_quantity;

        $response = $this->post('/order/checkout', [
            'order_type' => 'delivery',
            'customer_name' => 'Maria Clara',
            'customer_phone' => '09189876543',
            'delivery_address' => 'Blk 12 Lot 4 Barangay Bulihan, Cavite',
            'delivery_notes' => 'Ring doorbell upon arrival',
            'payment_method' => 'GCash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertSessionHasNoErrors();

        $order = Order::where('order_type', 'delivery')->latest('id')->first();
        $this->assertNotNull($order);
        $this->assertEquals('Blk 12 Lot 4 Barangay Bulihan, Cavite', $order->delivery_address);

        $product->refresh();
        $this->assertEquals($initialStock - 1, $product->stock_quantity);

        $this->assertDatabaseHas('audit_logs', [
            'action' => "Order #{$order->order_number} placed by Maria Clara (delivery) - Total: ₱" . number_format($order->total_amount, 2),
        ]);
    }

    public function test_dine_in_qr_order_flow(): void
    {
        $product = Product::where('name', 'like', '%Kare-Kare%')->first();
        $initialStock = $product->stock_quantity;

        $response = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '05',
            'customer_name' => 'Seated Guest',
            'delivery_notes' => 'Extra hot sizzling plate please',
            'payment_method' => 'Maya',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ],
        ]);

        $response->assertSessionHasNoErrors();

        $order = Order::where('order_type', 'dine_in')->latest('id')->first();
        $this->assertNotNull($order);
        $this->assertEquals('05', $order->table_number);

        $product->refresh();
        $this->assertEquals($initialStock - 3, $product->stock_quantity);

        $this->assertDatabaseHas('audit_logs', [
            'action' => "Order #{$order->order_number} placed by Seated Guest (dine_in) - Total: ₱" . number_format($order->total_amount, 2),
        ]);
    }
}

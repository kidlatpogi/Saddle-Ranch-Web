<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\TableSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TableSessionProtectionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_closed_table_blocks_dine_in_checkout(): void
    {
        // Table 02 is closed by default in seeder
        $product = Product::first();
        
        $response = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'branch' => 'Bulihan',
            'customer_name' => 'Troll Home Scanner',
            'customer_phone' => '09171234567',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertSessionHasErrors(['table_number']);
        $error = session('errors')->first('table_number');
        $this->assertStringContainsString('currently closed or its dining session has expired', $error);
    }

    public function test_staff_can_open_table_session(): void
    {
        $admin = User::where('role', 'admin')->first();

        $response = $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '02',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);

        $response->assertOk();
        $response->assertJson([
            'status' => 'success',
            'data' => [
                'table_number' => '02',
                'status' => 'active',
                'duration_minutes' => 60,
            ],
        ]);

        $this->assertTrue(TableSession::isTableActive('02', 'Bulihan'));
    }

    public function test_active_table_allows_dine_in_checkout(): void
    {
        // Open Table 02
        TableSession::updateOrCreate(
            ['table_number' => '02', 'branch' => 'Bulihan'],
            [
                'status' => 'active',
                'opened_at' => now(),
                'expires_at' => now()->addMinutes(60),
                'duration_minutes' => 60,
            ]
        );

        $product = Product::first();

        $response = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'branch' => 'Bulihan',
            'customer_name' => 'Valid Seated Guest',
            'customer_phone' => '09171234567',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('orders', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'customer_name' => 'Valid Seated Guest',
        ]);
    }

    public function test_expired_session_blocks_checkout(): void
    {
        // Table 02 expired 5 minutes ago
        TableSession::updateOrCreate(
            ['table_number' => '02', 'branch' => 'Bulihan'],
            [
                'status' => 'active',
                'opened_at' => now()->subMinutes(65),
                'expires_at' => now()->subMinutes(5),
                'duration_minutes' => 60,
            ]
        );

        $this->assertFalse(TableSession::isTableActive('02', 'Bulihan'));

        $product = Product::first();

        $response = $this->post('/order/checkout', [
            'order_type' => 'dine_in',
            'table_number' => '02',
            'branch' => 'Bulihan',
            'customer_name' => 'Late Diner',
            'customer_phone' => '09171234567',
            'payment_method' => 'Cash',
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1],
            ],
        ]);

        $response->assertSessionHasErrors(['table_number']);
    }

    public function test_staff_can_extend_and_close_session(): void
    {
        $admin = User::where('role', 'admin')->first();

        // Open Table 03
        $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '03',
            'branch' => 'Bulihan',
            'duration_minutes' => 30,
        ])->assertOk();

        // Extend +15 mins
        $extendRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/extend', [
            'table_number' => '03',
            'branch' => 'Bulihan',
            'minutes' => 15,
        ]);
        $extendRes->assertOk();
        $this->assertEquals(45, $extendRes->json('data.duration_minutes'));

        // Close session
        $closeRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/close', [
            'table_number' => '03',
            'branch' => 'Bulihan',
        ]);
        $closeRes->assertOk();
        $this->assertEquals('closed', $closeRes->json('data.status'));
        $this->assertFalse(TableSession::isTableActive('03', 'Bulihan'));
    }

    public function test_batch_open_and_close_operations(): void
    {
        $admin = User::where('role', 'admin')->first();

        // Batch open all tables
        $openAll = $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'open_all',
            'branch' => 'Bulihan',
            'duration_minutes' => 90,
        ]);
        $openAll->assertOk();
        $this->assertTrue(TableSession::isTableActive('01', 'Bulihan'));
        $this->assertTrue(TableSession::isTableActive('15', 'Bulihan'));
        $this->assertTrue(TableSession::isTableActive('25', 'Bulihan'));

        // Batch close all tables
        $closeAll = $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'close_all',
            'branch' => 'Bulihan',
        ]);
        $closeAll->assertOk();
        $this->assertFalse(TableSession::isTableActive('01', 'Bulihan'));
        $this->assertFalse(TableSession::isTableActive('15', 'Bulihan'));
        $this->assertFalse(TableSession::isTableActive('25', 'Bulihan'));
    }

    public function test_customer_polling_table_session_status(): void
    {
        // Table 04 is closed
        $response = $this->getJson('/api/v1/table-sessions/04?branch=Bulihan');
        $response->assertOk();
        $response->assertJson([
            'status' => 'success',
            'data' => [
                'table_number' => '04',
                'status' => 'closed',
                'is_active' => false,
            ],
        ]);

        // Open Table 04
        TableSession::updateOrCreate(
            ['table_number' => '04', 'branch' => 'Bulihan'],
            [
                'status' => 'active',
                'opened_at' => now(),
                'expires_at' => now()->addMinutes(60),
                'duration_minutes' => 60,
            ]
        );

        $response2 = $this->getJson('/api/v1/table-sessions/04?branch=Bulihan');
        $response2->assertOk();
        $response2->assertJson([
            'status' => 'success',
            'data' => [
                'table_number' => '04',
                'status' => 'active',
                'is_active' => true,
            ],
        ]);
        $this->assertGreaterThan(0, $response2->json('data.remaining_seconds'));
    }

    public function test_waiter_call_and_table_unlock_are_two_distinct_functions(): void
    {
        // 1. Calling waiter does NOT unlock the table
        $waiterResponse = $this->postJson('/api/v1/waiter-call', [
            'table_number' => '07',
            'branch' => 'Bulihan',
        ]);
        $waiterResponse->assertOk();

        // Ensure table remains closed
        $this->assertFalse(TableSession::isTableActive('07', 'Bulihan'));

        // Waiter calls has Table 07, Unlock requests does NOT
        $activeWaiters = $this->getJson('/api/v1/waiter-calls')->json('data');
        $this->assertTrue(collect($activeWaiters)->contains('table_number', '07'));

        $activeUnlocks = $this->getJson('/api/v1/table-unlock-requests')->json('data');
        $this->assertFalse(collect($activeUnlocks)->contains('table_number', '07'));

        // 2. Dismissing/Acknowledging waiter call does NOT unlock the table
        $dismissWaiter = $this->postJson('/api/v1/waiter-calls/dismiss', [
            'table_number' => '07',
        ]);
        $dismissWaiter->assertOk();
        $this->assertFalse(TableSession::isTableActive('07', 'Bulihan'));

        // 3. Requesting table unlock is a separate function
        $unlockReq = $this->postJson('/api/v1/table-unlock-request', [
            'table_number' => '07',
            'branch' => 'Bulihan',
        ]);
        $unlockReq->assertOk();

        $activeUnlocksAfter = $this->getJson('/api/v1/table-unlock-requests')->json('data');
        $this->assertTrue(collect($activeUnlocksAfter)->contains('table_number', '07'));

        // 4. Staff opening the table unlocks it and resolves the unlock request
        $staff = User::factory()->create(['role' => 'cashier']);
        $openResponse = $this->actingAs($staff)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '07',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);
        $openResponse->assertOk();

        $this->assertTrue(TableSession::isTableActive('07', 'Bulihan'));

        // Unlock request is resolved/cleared
        $activeUnlocksFinal = $this->getJson('/api/v1/table-unlock-requests')->json('data');
        $this->assertFalse(collect($activeUnlocksFinal)->contains('table_number', '07'));
    }

    public function test_table_sessions_index_returns_all_tables_with_accurate_active_count(): void
    {
        // Activate Table 01
        TableSession::updateOrCreate(
            ['table_number' => '01', 'branch' => 'Bulihan'],
            [
                'status' => 'active',
                'opened_at' => now(),
                'expires_at' => now()->addMinutes(60),
                'duration_minutes' => 60,
            ]
        );

        $response = $this->getJson('/api/v1/table-sessions?branch=Bulihan');
        $response->assertOk();
        $response->assertJsonStructure([
            'status',
            'data',
            'tables',
            'branch',
            'active_count',
            'closed_count',
        ]);

        $this->assertCount(25, $response->json('data'));
        $this->assertCount(25, $response->json('tables'));
        $this->assertGreaterThanOrEqual(1, $response->json('active_count'));
    }
}

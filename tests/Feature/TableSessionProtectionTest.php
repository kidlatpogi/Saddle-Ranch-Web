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

    public function test_cashier_can_only_manage_own_branch_tables(): void
    {
        $bulihanCashier = User::factory()->create([
            'role' => 'employee',
            'branch' => 'Bulihan',
        ]);

        // 1. Bulihan Cashier opening Bulihan table succeeds
        $resOk = $this->actingAs($bulihanCashier)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '08',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);
        $resOk->assertOk();
        $this->assertTrue(TableSession::isTableActive('08', 'Bulihan'));

        // 2. Bulihan Cashier attempting to open Dasma table returns 403
        $resForbidden = $this->actingAs($bulihanCashier)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '08',
            'branch' => 'Dasma',
            'duration_minutes' => 60,
        ]);
        $resForbidden->assertStatus(403);
        $this->assertStringContainsString('Unauthorized', $resForbidden->json('message'));

        // 3. Bulihan Cashier attempting to close Dasma table returns 403
        $resCloseForbidden = $this->actingAs($bulihanCashier)->postJson('/api/v1/table-sessions/close', [
            'table_number' => '08',
            'branch' => 'Dasma',
        ]);
        $resCloseForbidden->assertStatus(403);

        // 4. Bulihan Cashier attempting to batch open Dasma tables returns 403
        $resBatchForbidden = $this->actingAs($bulihanCashier)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'open_all',
            'branch' => 'Dasma',
        ]);
        $resBatchForbidden->assertStatus(403);

        // 5. Bulihan Cashier attempting to query Dasma table list returns 403
        $resIndexForbidden = $this->actingAs($bulihanCashier)->getJson('/api/v1/table-sessions?branch=Dasma');
        $resIndexForbidden->assertStatus(403);
    }

    public function test_admin_can_manage_both_branches_individually(): void
    {
        $admin = User::where('role', 'admin')->first();

        // Admin can open Bulihan table
        $resBulihan = $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '09',
            'branch' => 'Bulihan',
            'duration_minutes' => 45,
        ]);
        $resBulihan->assertOk();
        $this->assertTrue(TableSession::isTableActive('09', 'Bulihan'));

        // Admin can open Dasma table
        $resDasma = $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '09',
            'branch' => 'Dasma',
            'duration_minutes' => 45,
        ]);
        $resDasma->assertOk();
        $this->assertTrue(TableSession::isTableActive('09', 'Dasma'));
    }

    public function test_prefixed_table_codes_sync_and_close_properly(): void
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Open table using 'B-01'
        $openRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => 'B-01',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);
        $openRes->assertOk();

        // Must be active under both 'B-01', '01', and '1'
        $this->assertTrue(TableSession::isTableActive('B-01', 'Bulihan'));
        $this->assertTrue(TableSession::isTableActive('01', 'Bulihan'));
        $this->assertTrue(TableSession::isTableActive('1', 'Bulihan'));

        // Customer polling 'B-01' sees it active
        $pollRes = $this->getJson('/api/v1/table-sessions/B-01?branch=Bulihan');
        $pollRes->assertOk();
        $this->assertTrue($pollRes->json('data.is_active'));
        $this->assertEquals('active', $pollRes->json('data.status'));

        // 2. Staff closing '01' closes 'B-01' as well
        $closeRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/close', [
            'table_number' => '01',
            'branch' => 'Bulihan',
        ]);
        $closeRes->assertOk();

        $this->assertFalse(TableSession::isTableActive('B-01', 'Bulihan'));
        $this->assertFalse(TableSession::isTableActive('01', 'Bulihan'));

        // 3. Opening '01' and closing 'B-01' works vice versa
        $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '01',
            'branch' => 'Bulihan',
        ]);
        $this->assertTrue(TableSession::isTableActive('B-01', 'Bulihan'));

        $this->actingAs($admin)->postJson('/api/v1/table-sessions/close', [
            'table_number' => 'B-01',
            'branch' => 'Bulihan',
        ]);
        $this->assertFalse(TableSession::isTableActive('B-01', 'Bulihan'));
        $this->assertFalse(TableSession::isTableActive('01', 'Bulihan'));
    }

    public function test_admin_can_dynamically_add_and_delete_tables(): void
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Add new table 26
        $addRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/add', [
            'branch' => 'Bulihan',
        ]);
        $addRes->assertOk();
        $this->assertEquals('26', $addRes->json('data.table_number'));

        // 2. Index includes table 26
        $indexRes = $this->getJson('/api/v1/table-sessions?branch=Bulihan');
        $indexRes->assertOk();
        $this->assertGreaterThanOrEqual(26, count($indexRes->json('data')));

        // 3. Batch open opens table 26 as well
        $batchRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'open_all',
            'branch' => 'Bulihan',
        ]);
        $batchRes->assertOk();
        $this->assertTrue(TableSession::isTableActive('26', 'Bulihan'));
        $this->assertTrue(TableSession::isTableActive('B-26', 'Bulihan'));

        // 4. Delete table 26
        $delRes = $this->actingAs($admin)->deleteJson('/api/v1/table-sessions/26?branch=Bulihan');
        $delRes->assertOk();

        // 5. Index no longer includes table 26
        $indexRes2 = $this->getJson('/api/v1/table-sessions?branch=Bulihan');
        $tableNums = collect($indexRes2->json('data'))->pluck('table_number');
        $this->assertFalse($tableNums->contains('26'));
    }

    public function test_dasma_table_d10_unlock_flow_syncs_properly(): void
    {
        $admin = User::where('role', 'admin')->first();

        // 1. Mobile customer requests unlock for Table D-10 at Dasma
        $reqRes = $this->postJson('/api/v1/table-unlock-request', [
            'table_number' => '10',
            'branch' => 'Dasma',
        ]);
        $reqRes->assertOk();

        // 2. Mobile status polling without branch query param recognizes D-10 and returns pending
        $statusRes1 = $this->getJson('/api/v1/table-unlock-request/status?table_number=D-10');
        $statusRes1->assertOk();
        $this->assertEquals('pending', $statusRes1->json('data.status'));

        // 3. Cashier station opens session for Table 10 at Dasma branch
        $openRes = $this->actingAs($admin)->postJson('/api/v1/table-sessions/open', [
            'table_number' => '10',
            'branch' => 'Dasma',
            'duration_minutes' => 60,
        ]);
        $openRes->assertOk();

        // 4. Real-time status polling for D-10 (and variants) returns unlocked immediately
        $statusRes2 = $this->getJson('/api/v1/table-unlock-request/status?table_number=D-10');
        $statusRes2->assertOk();
        $this->assertEquals('unlocked', $statusRes2->json('data.status'));

        $statusRes3 = $this->getJson('/api/v1/table-unlock-request/status?table_number=10&branch=Dasma');
        $statusRes3->assertOk();
        $this->assertEquals('unlocked', $statusRes3->json('data.status'));

        // 5. TableSession polling for mobile customer shows active
        $sessionRes = $this->getJson('/api/v1/table-sessions/D-10?branch=Dasma');
        $sessionRes->assertOk();
        $this->assertTrue($sessionRes->json('data.is_active'));
        $this->assertEquals('active', $sessionRes->json('data.status'));
    }

    public function test_branch_isolation_notifications_and_batch_operations(): void
    {
        $admin = User::where('role', 'admin')->first();

        // Ensure both branches are seeded and clean
        $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', ['branch' => 'Bulihan', 'action' => 'close_all'])->assertOk();
        $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', ['branch' => 'Dasma', 'action' => 'close_all'])->assertOk();

        // 1. Customer requests access to Dasma Table 3
        $reqRes = $this->postJson('/api/v1/table-unlock-request', [
            'table_number' => '03',
            'branch' => 'Dasma',
        ]);
        $reqRes->assertOk();

        // 2. Bulihan cashier must NOT receive this notification
        $bulihanNotifs = $this->getJson('/api/v1/table-unlock-requests?branch=Bulihan')->json('data');
        $this->assertFalse(collect($bulihanNotifs)->contains('table_number', '03'));
        $this->assertCount(0, $bulihanNotifs);

        // 3. Dasma cashier MUST receive this notification
        $dasmaNotifs = $this->getJson('/api/v1/table-unlock-requests?branch=Dasma')->json('data');
        $this->assertTrue(collect($dasmaNotifs)->contains('table_number', '03'));
        $this->assertCount(1, $dasmaNotifs);

        // 4. Bulihan cashier performs "Open All"
        $openBulihan = $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'open_all',
            'branch' => 'Bulihan',
            'duration_minutes' => 60,
        ]);
        $openBulihan->assertOk();

        // Bulihan Table 03 is now active
        $this->assertTrue(TableSession::isTableActive('03', 'Bulihan'));

        // Dasma Table 03 MUST STILL BE CLOSED!
        $this->assertFalse(TableSession::isTableActive('03', 'Dasma'));

        // Dasma Table 03 status polling MUST STILL BE PENDING (not affected by Bulihan Open All)
        $dasmaStatus = $this->getJson('/api/v1/table-unlock-request/status?table_number=03&branch=Dasma')->json('data.status');
        $this->assertEquals('pending', $dasmaStatus);

        // Dasma active unlock requests MUST STILL EXIST (not wiped by Bulihan Open All)
        $dasmaNotifsStillThere = $this->getJson('/api/v1/table-unlock-requests?branch=Dasma')->json('data');
        $this->assertCount(1, $dasmaNotifsStillThere);

        // 5. Bulihan cashier performs "Close All"
        $closeBulihan = $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'close_all',
            'branch' => 'Bulihan',
        ]);
        $closeBulihan->assertOk();

        // Bulihan Table 03 is now closed
        $this->assertFalse(TableSession::isTableActive('03', 'Bulihan'));

        // Dasma Table 03 is still closed and notification still intact
        $this->assertFalse(TableSession::isTableActive('03', 'Dasma'));
        $this->assertCount(1, $this->getJson('/api/v1/table-unlock-requests?branch=Dasma')->json('data'));

        // 6. Dasma cashier performs "Open All"
        $openDasma = $this->actingAs($admin)->postJson('/api/v1/table-sessions/batch', [
            'action' => 'open_all',
            'branch' => 'Dasma',
            'duration_minutes' => 60,
        ]);
        $openDasma->assertOk();

        // Dasma Table 03 is now active!
        $this->assertTrue(TableSession::isTableActive('03', 'Dasma'));

        // Bulihan Table 03 is STILL closed!
        $this->assertFalse(TableSession::isTableActive('03', 'Bulihan'));

        // Dasma status polling is now unlocked
        $dasmaStatusUnlocked = $this->getJson('/api/v1/table-unlock-request/status?table_number=03&branch=Dasma')->json('data.status');
        $this->assertEquals('unlocked', $dasmaStatusUnlocked);

        // Dasma unlock requests are cleared after opening
        $dasmaNotifsCleared = $this->getJson('/api/v1/table-unlock-requests?branch=Dasma')->json('data');
        $this->assertCount(0, $dasmaNotifsCleared);
    }
}

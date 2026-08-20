<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class StorageAssetRouteTest extends TestCase
{
    public function test_can_access_storage_asset_fallback_route()
    {
        $dir = storage_path('app/public');
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents($dir . '/test_ping.txt', 'saddle_ranch_asset_ping');

        $response = $this->get('/storage/test_ping.txt');
        $response->assertStatus(200);

        @unlink($dir . '/test_ping.txt');
    }
}

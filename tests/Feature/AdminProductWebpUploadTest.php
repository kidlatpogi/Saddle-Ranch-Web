<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminProductWebpUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_admin_can_create_product_with_webp_image()
    {
        Storage::fake('public');

        $admin = User::where('role', 'admin')->first();
        $webpFile = UploadedFile::fake()->create('custom_sizzler.webp', 1500, 'image/webp');

        $response = $this->actingAs($admin)->post('/admin/products', [
            'name' => 'Sizzling Ribeye Porterhouse',
            'description' => 'Charcoal-grilled premium cut on cast iron.',
            'price' => 380.00,
            'price_bulihan' => 380.00,
            'price_dasmarinas' => 395.00,
            'stock_quantity' => 25,
            'stock_bulihan' => 15,
            'stock_dasmarinas' => 10,
            'is_active' => true,
            'image' => $webpFile,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $product = Product::where('name', 'Sizzling Ribeye Porterhouse')->first();
        $this->assertNotNull($product);
        $this->assertStringContainsString('products/', $product->image_path);
        $this->assertStringContainsString('.webp', $product->image_path);
    }

    public function test_admin_can_update_product_with_new_webp_image()
    {
        Storage::fake('public');

        $admin = User::where('role', 'admin')->first();
        $product = Product::first();

        $newWebpFile = UploadedFile::fake()->create('updated_dish.webp', 800, 'image/webp');

        $response = $this->actingAs($admin)->post("/admin/products/{$product->id}", [
            'name' => 'Updated Special Sizzler',
            'description' => 'Updated description with new WebP photo.',
            'price' => 210.00,
            'price_bulihan' => 210.00,
            'price_dasmarinas' => 225.00,
            'stock_quantity' => 45,
            'stock_bulihan' => 25,
            'stock_dasmarinas' => 20,
            'is_active' => true,
            'image' => $newWebpFile,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $product->refresh();
        $this->assertEquals('Updated Special Sizzler', $product->name);
        $this->assertStringContainsString('.webp', $product->image_path);
    }

    public function test_image_upload_fails_when_exceeding_10mb_limit()
    {
        Storage::fake('public');

        $admin = User::where('role', 'admin')->first();
        // 12 MB file (12 * 1024 = 12288 KB)
        $oversizedFile = UploadedFile::fake()->create('huge_photo.webp', 12288, 'image/webp');

        $response = $this->actingAs($admin)->post('/admin/products', [
            'name' => 'Oversized Item',
            'price' => 150.00,
            'stock_quantity' => 10,
            'image' => $oversizedFile,
        ]);

        $response->assertSessionHasErrors(['image']);
    }

    public function test_admin_can_permanently_delete_product()
    {
        $admin = User::where('role', 'admin')->first();
        $product = Product::create([
            'name' => 'Temporary Sizzling T-Bone',
            'price' => 450.00,
            'stock_quantity' => 20,
            'is_active' => true,
            'image_path' => '/images/sisig.webp',
        ]);

        $response = $this->actingAs($admin)->delete("/admin/products/{$product->id}");
        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
        $this->assertDatabaseHas('audit_logs', [
            'action' => "Permanently deleted Product 'Temporary Sizzling T-Bone'",
        ]);
    }

    public function test_admin_can_toggle_product_status()
    {
        $admin = User::where('role', 'admin')->first();
        $product = Product::first();
        $initialStatus = $product->is_active;

        $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/toggle");
        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $product->refresh();
        $this->assertEquals(!$initialStatus, $product->is_active);
    }
}

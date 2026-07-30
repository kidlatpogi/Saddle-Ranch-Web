<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductManagementController extends Controller
{
    /**
     * Display all products (active and inactive) with stock levels.
     */
    public function index(): Response
    {
        $products = Product::orderBy('id', 'asc')->get();

        return Inertia::render('Admin/Products', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_bulihan' => 'nullable|numeric|min:0',
            'price_dasmarinas' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'stock_bulihan' => 'nullable|integer|min:0',
            'stock_dasmarinas' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imagePath = Storage::url($path);
        }

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'price_bulihan' => $validated['price_bulihan'] ?? $validated['price'],
            'price_dasmarinas' => $validated['price_dasmarinas'] ?? $validated['price'],
            'stock_quantity' => $validated['stock_quantity'],
            'stock_bulihan' => $validated['stock_bulihan'] ?? $validated['stock_quantity'],
            'stock_dasmarinas' => $validated['stock_dasmarinas'] ?? $validated['stock_quantity'],
            'is_active' => $validated['is_active'] ?? true,
            'image_path' => $imagePath ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt2cP7W6u7Hw-wJCWrbYiEh20Z4b79UCpbKxmmyVbQzw0xlTklDnEKOpEzeymppd9l-ODs0TOelRWM0iLgwF8K_OKfXIBpTO8lSH0yyxPtaMCTQrzQ4ykSkJPDryw9S9IBB1wNoeHFGtHcQDy4MEVr0_tUDss7SKe1fe58XBlXeql1nJ1D2J0zJ0ZFO4qRm213kO813mLEdYdUMjsTD0J2PtB7cz_0FmmDHccmacBmhMyp7a_fJ7teNVsG3sgWyfW24O1p08mnUE9t',
        ]);

        // Audit Log Trigger
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Created Product '{$product->name}' with Bulihan Price ₱{$product->price_bulihan} (Stock: {$product->stock_bulihan}) & Dasmariñas Price ₱{$product->price_dasmarinas} (Stock: {$product->stock_dasmarinas})",
            'ip_address' => $request->ip(),
            'payload' => [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock' => $product->stock_quantity,
            ],
        ]);

        return back()->with('success', 'Product created successfully.');
    }

    /**
     * Update product details and image replacement.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_bulihan' => 'nullable|numeric|min:0',
            'price_dasmarinas' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'stock_bulihan' => 'nullable|integer|min:0',
            'stock_dasmarinas' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        $oldPrice = $product->price;

        if ($request->hasFile('image')) {
            // Delete old file if stored locally
            if ($product->image_path && str_contains($product->image_path, '/storage/')) {
                $oldRelative = str_replace('/storage/', '', $product->image_path);
                Storage::disk('public')->delete($oldRelative);
            }

            $path = $request->file('image')->store('products', 'public');
            $product->image_path = Storage::url($path);
        }

        $product->name = $validated['name'];
        $product->description = $validated['description'] ?? null;
        $product->price = $validated['price'];
        $product->price_bulihan = $validated['price_bulihan'] ?? $validated['price'];
        $product->price_dasmarinas = $validated['price_dasmarinas'] ?? $validated['price'];
        $product->stock_quantity = $validated['stock_quantity'];
        $product->stock_bulihan = $validated['stock_bulihan'] ?? $validated['stock_quantity'];
        $product->stock_dasmarinas = $validated['stock_dasmarinas'] ?? $validated['stock_quantity'];
        $product->is_active = $validated['is_active'] ?? $product->is_active;
        $product->save();

        // Audit Log Trigger
        $priceChangeText = ($oldPrice != $product->price) ? " (Price changed from ₱{$oldPrice} to ₱{$product->price})" : "";
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Updated Product '{$product->name}'{$priceChangeText} with stock {$product->stock_quantity}",
            'ip_address' => $request->ip(),
            'payload' => [
                'product_id' => $product->id,
                'name' => $product->name,
                'old_price' => $oldPrice,
                'new_price' => $product->price,
                'stock' => $product->stock_quantity,
            ],
        ]);

        return back()->with('success', 'Product updated successfully.');
    }

    /**
     * Soft-delete or toggle active state.
     */
    public function destroy(Request $request, int $id): RedirectResponse
    {
        $product = Product::findOrFail($id);
        $product->is_active = !$product->is_active;
        $product->save();

        $actionText = $product->is_active ? 'Activated' : 'Deactivated';

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "{$actionText} Product '{$product->name}'",
            'ip_address' => $request->ip(),
            'payload' => [
                'product_id' => $product->id,
                'name' => $product->name,
                'is_active' => $product->is_active,
            ],
        ]);

        return back()->with('success', "Product {$actionText} successfully.");
    }
}

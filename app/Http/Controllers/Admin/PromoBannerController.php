<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PromoBanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PromoBannerController extends Controller
{
    public function index(): Response
    {
        $banners = PromoBanner::orderBy('display_order', 'asc')->get();

        return Inertia::render('Admin/Banners', [
            'banners' => $banners,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'branch' => 'nullable|string|in:all,bulihan,dasmarinas',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $imagePath = Storage::url($path);
        }

        $banner = PromoBanner::create([
            'title' => $validated['title'],
            'branch' => $validated['branch'] ?? 'all',
            'display_order' => $validated['display_order'] ?? 1,
            'is_active' => $validated['is_active'] ?? true,
            'image_path' => $imagePath ?? '/images/sisig.webp',
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Created Promo Banner '{$banner->title}' (Branch: {$banner->branch})",
            'ip_address' => $request->ip(),
            'payload' => ['banner_id' => $banner->id, 'title' => $banner->title],
        ]);

        return back()->with('success', 'Promo banner created successfully.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $banner = PromoBanner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'branch' => 'nullable|string|in:all,bulihan,dasmarinas',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,webp,gif,svg|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($banner->image_path && str_contains($banner->image_path, '/storage/')) {
                $oldRelative = str_replace('/storage/', '', $banner->image_path);
                Storage::disk('public')->delete($oldRelative);
            }

            $path = $request->file('image')->store('banners', 'public');
            $banner->image_path = Storage::url($path);
        }

        $banner->title = $validated['title'];
        $banner->branch = $validated['branch'] ?? $banner->branch;
        $banner->display_order = $validated['display_order'] ?? $banner->display_order;
        $banner->is_active = $validated['is_active'] ?? $banner->is_active;
        $banner->save();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Updated Promo Banner '{$banner->title}'",
            'ip_address' => $request->ip(),
            'payload' => ['banner_id' => $banner->id, 'title' => $banner->title],
        ]);

        return back()->with('success', 'Promo banner updated successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $banner = PromoBanner::findOrFail($id);
        $banner->is_active = !$banner->is_active;
        $banner->save();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Toggled Promo Banner '{$banner->title}' active state to {$banner->is_active}",
            'ip_address' => request()->ip(),
            'payload' => ['banner_id' => $banner->id, 'is_active' => $banner->is_active],
        ]);

        return back()->with('success', 'Promo banner status updated.');
    }
}

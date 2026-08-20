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
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension() ?: 'webp';
            $filename = time() . '_' . \Illuminate\Support\Str::random(12) . '.' . $extension;

            $targetDir = public_path('images/banners');
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $file->move($targetDir, $filename);
            $imagePath = '/images/banners/' . $filename;

            try {
                $storageDir = storage_path('app/public/banners');
                if (!file_exists($storageDir)) {
                    mkdir($storageDir, 0755, true);
                }
                copy($targetDir . '/' . $filename, $storageDir . '/' . $filename);
            } catch (\Throwable $e) {
                // ignore
            }
        }

        $defaultBannerImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuASVSO6N3lzIbdlCDT85viSxOZiQKjWADlA5k7ymludjTdSCB7tqV0bZvXRba3-L4gemLyqy9PxmqnYMBnSsxb5yfI_XM-qajS5ZEnS1Am8OBu5uN8_smBFlDdy4xR0UNE8jDFJP8vNSRQcqqDSG4p-oDij5kCvWALcyBZVeuA1QdnqC9a6I5s9l2ba3Zjfe0xSPjMr0jLCAB1z-oJS5xBL9meeUeFsmiMgjQ96VoXotgHsy3Jl3d9NQIv1liJsKeu_sJec2rrkNziY';

        $banner = PromoBanner::create([
            'title' => $validated['title'],
            'branch' => $validated['branch'] ?? 'all',
            'display_order' => $validated['display_order'] ?? 1,
            'is_active' => $validated['is_active'] ?? true,
            'image_path' => $imagePath ?? $defaultBannerImg,
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
            if ($banner->image_path && str_starts_with($banner->image_path, '/images/banners/')) {
                $oldFile = public_path(ltrim($banner->image_path, '/'));
                if (file_exists($oldFile)) {
                    @unlink($oldFile);
                }
            }
            if ($banner->image_path && str_contains($banner->image_path, '/storage/')) {
                $oldRelative = str_replace('/storage/', '', $banner->image_path);
                Storage::disk('public')->delete($oldRelative);
            }

            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension() ?: 'webp';
            $filename = time() . '_' . \Illuminate\Support\Str::random(12) . '.' . $extension;

            $targetDir = public_path('images/banners');
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            $file->move($targetDir, $filename);
            $banner->image_path = '/images/banners/' . $filename;

            try {
                $storageDir = storage_path('app/public/banners');
                if (!file_exists($storageDir)) {
                    mkdir($storageDir, 0755, true);
                }
                copy($targetDir . '/' . $filename, $storageDir . '/' . $filename);
            } catch (\Throwable $e) {
                // ignore
            }
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

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    public function index(): Response
    {
        $vouchers = Voucher::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Vouchers', [
            'vouchers' => $vouchers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:vouchers,code|max:50',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_spend' => 'nullable|numeric|min:0',
            'is_one_time_use' => 'nullable|boolean',
            'is_limited_time' => 'nullable|boolean',
            'branch' => 'nullable|string',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
        ]);

        $voucher = Voucher::create([
            'code' => strtoupper(trim($validated['code'])),
            'discount_type' => $validated['discount_type'],
            'value' => $validated['value'],
            'min_spend' => $validated['min_spend'] ?? 0,
            'is_one_time_use' => $validated['is_one_time_use'] ?? false,
            'is_limited_time' => $validated['is_limited_time'] ?? false,
            'branch' => $validated['branch'] ?? 'all',
            'starts_at' => $validated['starts_at'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Created Voucher Code '{$voucher->code}' ({$voucher->discount_type} ₱{$voucher->value}, One-Time: " . ($voucher->is_one_time_use ? 'Yes' : 'No') . ", Limited Time: " . ($voucher->is_limited_time ? 'Yes' : 'No') . ")",
            'ip_address' => $request->ip(),
            'payload' => ['voucher_id' => $voucher->id, 'code' => $voucher->code],
        ]);

        return back()->with('success', 'Voucher created successfully.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $voucher = Voucher::findOrFail($id);
        $code = $voucher->code;
        $voucher->delete();

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Deleted Voucher Code '{$code}'",
            'ip_address' => request()->ip(),
            'payload' => ['code' => $code],
        ]);

        return back()->with('success', 'Voucher deleted successfully.');
    }

    /**
     * API Validation Endpoint for customer checkout (POST /api/v1/vouchers/validate)
     */
    public function validateVoucher(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'total_amount' => 'required|numeric',
        ]);

        $user = auth()->user();

        // 1. Mandatory Rule: User MUST be logged-in to use coupons/vouchers!
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'You must be logged in to apply a promo coupon or voucher code.',
                'requires_auth' => true,
            ], 401);
        }

        $voucher = Voucher::where('code', strtoupper(trim($request->code)))->first();

        if (!$voucher) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid promo coupon or voucher code.',
            ], 404);
        }

        $now = now();

        // 2. Date Activated & Date Ended Validation
        if ($voucher->is_limited_time || $voucher->starts_at || $voucher->expires_at) {
            if ($voucher->starts_at && $now->lessThan($voucher->starts_at)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This promo code is not active yet. Activated on: ' . $voucher->starts_at->format('M d, Y g:i A'),
                ], 422);
            }

            if ($voucher->expires_at && $now->greaterThan($voucher->expires_at)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This promo code has expired on ' . $voucher->expires_at->format('M d, Y g:i A') . '.',
                ], 422);
            }
        }

        // 3. One-Time Use Validation
        if ($voucher->is_one_time_use) {
            $alreadyUsed = \App\Models\VoucherUsage::where('voucher_id', $voucher->id)
                ->where('user_id', $user->id)
                ->exists();

            if ($alreadyUsed) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already redeemed this 1-time use voucher code.',
                ], 422);
            }
        }

        // 4. Minimum Spend Validation
        if ($request->total_amount < $voucher->min_spend) {
            return response()->json([
                'status' => 'error',
                'message' => "Minimum order amount of ₱" . number_format($voucher->min_spend, 2) . " required to use code '{$voucher->code}'.",
            ], 422);
        }

        // 5. Calculate Discount Amount
        $discount = 0;
        if ($voucher->discount_type === 'percentage') {
            $discount = ($request->total_amount * ($voucher->value / 100));
        } else {
            $discount = min($request->total_amount, $voucher->value);
        }

        $discount = round($discount, 2);
        $finalAmount = round(max(0, $request->total_amount - $discount), 2);

        return response()->json([
            'status' => 'success',
            'message' => 'Promo code applied successfully!',
            'voucher' => $voucher,
            'discount_amount' => $discount,
            'final_amount' => $finalAmount,
        ]);
    }
}

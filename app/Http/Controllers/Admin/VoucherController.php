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
            'expires_at' => 'nullable|date',
        ]);

        $voucher = Voucher::create([
            'code' => strtoupper($validated['code']),
            'discount_type' => $validated['discount_type'],
            'value' => $validated['value'],
            'min_spend' => $validated['min_spend'] ?? 0,
            'expires_at' => $validated['expires_at'] ?? null,
        ]);

        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => "Created Voucher Code '{$voucher->code}' ({$voucher->discount_type} ₱{$voucher->value})",
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

        $voucher = Voucher::where('code', strtoupper($request->code))->first();

        if (!$voucher) {
            return response()->json(['message' => 'Invalid or expired voucher code.'], 404);
        }

        if ($voucher->expires_at && now()->greaterThan($voucher->expires_at)) {
            return response()->json(['message' => 'Voucher code has expired.'], 422);
        }

        if ($request->total_amount < $voucher->min_spend) {
            return response()->json([
                'message' => "Minimum spend of ₱{$voucher->min_spend} required for code {$voucher->code}.",
            ], 422);
        }

        $discount = 0;
        if ($voucher->discount_type === 'percentage') {
            $discount = ($request->total_amount * ($voucher->value / 100));
        } else {
            $discount = min($request->total_amount, $voucher->value);
        }

        return response()->json([
            'status' => 'success',
            'voucher' => $voucher,
            'discount_amount' => round($discount, 2),
            'final_amount' => round(max(0, $request->total_amount - $discount), 2),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\EmailOtp;
use App\Models\User;
use App\Services\EmailOtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class CustomerAuthController extends Controller
{
    public function __construct(private EmailOtpService $otpService) {}

    /**
     * Expose OTP in API responses only for local + log mailer testing.
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    private function withDebugOtp(array $payload, ?string $code): array
    {
        $show = app()->environment('local')
            && filter_var(env('MAIL_SHOW_DEBUG_OTP', true), FILTER_VALIDATE_BOOLEAN);

        if ($show && $code) {
            $payload['debug_code'] = $code;
        }

        return $payload;
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);
        $credentials['email'] = strtolower(trim($credentials['email']));

        if (!Auth::validate($credentials)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email address or password.',
            ], 401);
        }

        $user = User::where('email', $credentials['email'])->firstOrFail();

        if (!$user->email_verified_at) {
            $code = $this->otpService->issue($user->email, EmailOtp::PURPOSE_VERIFY, $user);

            AuditLog::create([
                'user_id' => $user->id,
                'action' => "Verification code resent to {$user->email} (unverified login attempt)",
                'ip_address' => $request->ip(),
                'payload' => ['email' => $user->email, 'purpose' => EmailOtp::PURPOSE_VERIFY],
            ]);

            return response()->json($this->withDebugOtp([
                'status' => 'needs_verification',
                'message' => 'Please verify your email. A 6-digit code was sent to your inbox.',
                'email' => $user->email,
                'retry_after' => EmailOtpService::RESEND_COOLDOWN_SECONDS,
            ], $code));
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Customer {$user->name} logged in via Checkout Auth Modal",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Logged in successfully!',
            'user' => $user->fresh(),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone_number' => 'nullable|string|regex:/^[0-9]{11}$/',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.unique' => 'An account with this email address already exists. Please sign in.',
            'phone_number.regex' => 'Mobile number must consist of 11 numeric digits.',
            'password.confirmed' => 'Account password and confirmation password do not match.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone_number' => $validated['phone_number'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'user',
        ]);

        $code = $this->otpService->issue($user->email, EmailOtp::PURPOSE_VERIFY, $user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "New Customer Account Registered (unverified): {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'name' => $user->name, 'verified' => false],
        ]);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Verification code sent to {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'purpose' => EmailOtp::PURPOSE_VERIFY],
        ]);

        return response()->json($this->withDebugOtp([
            'status' => 'success',
            'message' => 'Account created. Enter the 6-digit code sent to your email to verify.',
            'requires_email_verification' => true,
            'needs_verification' => true,
            'email' => $user->email,
            'retry_after' => EmailOtpService::RESEND_COOLDOWN_SECONDS,
        ], $code), 201);
    }

    public function verifyEmail(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Account not found.',
            ], 404);
        }

        if ($user->email_verified_at) {
            Auth::login($user, true);
            $request->session()->regenerate();

            return response()->json([
                'status' => 'success',
                'message' => 'Account already verified.',
                'user' => $user,
            ]);
        }

        try {
            $this->otpService->verify($email, EmailOtp::PURPOSE_VERIFY, $validated['code']);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => collect($e->errors())->flatten()->first() ?: 'Invalid code.',
                'errors' => $e->errors(),
            ], 422);
        }

        $user->forceFill(['email_verified_at' => now()])->save();

        Auth::login($user, true);
        $request->session()->regenerate();

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Customer account verified: {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'verified' => true],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully!',
            'user' => $user->fresh(),
        ]);
    }

    public function resendVerification(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'success',
                'message' => 'If that email exists, a new code has been sent.',
            ]);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'status' => 'success',
                'message' => 'This account is already verified. You can sign in.',
            ]);
        }

        $wait = $this->otpService->resendCooldownSeconds($user->email, EmailOtp::PURPOSE_VERIFY);
        if ($wait > 0) {
            return response()->json([
                'status' => 'error',
                'message' => "Please wait {$wait} seconds before requesting a new code.",
                'retry_after' => $wait,
            ], 429);
        }

        $code = $this->otpService->issue($user->email, EmailOtp::PURPOSE_VERIFY, $user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Verification code resent to {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'purpose' => EmailOtp::PURPOSE_VERIFY],
        ]);

        return response()->json($this->withDebugOtp([
            'status' => 'success',
            'message' => 'A new 6-digit verification code has been sent.',
            'email' => $user->email,
            'retry_after' => EmailOtpService::RESEND_COOLDOWN_SECONDS,
        ], $code));
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();
        $code = null;

        if ($user) {
            $code = $this->otpService->issue($user->email, EmailOtp::PURPOSE_RESET, $user);

            AuditLog::create([
                'user_id' => $user->id,
                'action' => "Password reset code sent to {$user->email}",
                'ip_address' => $request->ip(),
                'payload' => ['email' => $user->email, 'purpose' => EmailOtp::PURPOSE_RESET],
            ]);
        }

        return response()->json($this->withDebugOtp([
            'status' => 'success',
            'message' => 'If that email exists, a 6-digit reset code has been sent.',
            'email' => $email,
        ], $code));
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.confirmed' => 'New password and confirmation do not match.',
        ]);

        $email = strtolower(trim($validated['email']));
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Account not found.',
            ], 404);
        }

        try {
            $this->otpService->verify($email, EmailOtp::PURPOSE_RESET, $validated['code']);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => collect($e->errors())->flatten()->first() ?: 'Invalid code.',
                'errors' => $e->errors(),
            ], 422);
        }

        $user->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        // If account was never verified, mark verified after proving email ownership via OTP.
        if (!$user->email_verified_at) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Password reset completed for {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email],
        ]);

        Auth::login($user, true);
        $request->session()->regenerate();

        return response()->json([
            'status' => 'success',
            'message' => 'Password updated successfully. You are now signed in.',
            'user' => $user->fresh(),
        ]);
    }
}

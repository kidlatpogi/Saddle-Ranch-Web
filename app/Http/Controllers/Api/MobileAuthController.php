<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\EmailOtp;
use App\Models\User;
use App\Services\EmailOtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MobileAuthController extends Controller
{
    public function __construct(private EmailOtpService $otpService) {}

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone_number' => $user->phone_number,
            'email_verified_at' => $user->email_verified_at,
        ];
    }

    private function issueToken(User $user): string
    {
        return $user->createToken('flutter-mobile-token')->plainTextToken;
    }

    /**
     * POST /api/v1/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower(trim($credentials['email']));
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid login credentials.',
            ], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'status' => 'error',
                'message' => 'Please verify your email with the 6-digit code first.',
                'requires_email_verification' => true,
                'email' => $user->email,
            ], 403);
        }

        $token = $this->issueToken($user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Customer {$user->name} logged in via Flutter mobile app",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'client' => 'flutter'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $this->userPayload($user),
        ]);
    }

    /**
     * POST /api/v1/auth/verify-email
     */
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
            $token = $this->issueToken($user);

            return response()->json([
                'status' => 'success',
                'message' => 'Email verified successfully.',
                'token' => $token,
                'user' => $this->userPayload($user),
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

        $token = $this->issueToken($user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Customer account verified via Flutter: {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'client' => 'flutter', 'verified' => true],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully.',
            'token' => $token,
            'user' => $this->userPayload($user->fresh()),
        ]);
    }

    /**
     * POST /api/v1/auth/resend-verification
     */
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

        $this->otpService->issue($user->email, EmailOtp::PURPOSE_VERIFY, $user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Verification code resent via Flutter to {$user->email}",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'purpose' => EmailOtp::PURPOSE_VERIFY, 'client' => 'flutter'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'A new 6-digit verification code has been sent.',
            'email' => $user->email,
            'retry_after' => EmailOtpService::RESEND_COOLDOWN_SECONDS,
        ]);
    }

    /**
     * POST /api/v1/auth/forgot-password
     * Uses Laravel Password broker (email contains reset token).
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink([
            'email' => strtolower(trim($request->input('email'))),
        ]);

        if ($status === Password::RESET_LINK_SENT || $status === Password::INVALID_USER) {
            // Same message whether user exists (avoid email enumeration)
            return response()->json([
                'status' => 'success',
                'message' => 'If that email exists, a password reset link has been sent.',
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => __($status),
        ], 422);
    }

    /**
     * POST /api/v1/auth/reset-password
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            [
                'email' => strtolower(trim($request->input('email'))),
                'password' => $request->input('password'),
                'password_confirmation' => $request->input('password_confirmation'),
                'token' => $request->input('token'),
            ],
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                if (!$user->email_verified_at) {
                    $user->forceFill(['email_verified_at' => now()])->save();
                }

                // Revoke existing Sanctum tokens after password change
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'error',
                'message' => __($status),
            ], 422);
        }

        $user = User::where('email', strtolower(trim($request->input('email'))))->first();

        AuditLog::create([
            'user_id' => $user?->id,
            'action' => 'Password reset completed via Flutter Password broker',
            'ip_address' => $request->ip(),
            'payload' => ['email' => $request->input('email'), 'client' => 'flutter'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password has been reset successfully.',
        ]);
    }

    /**
     * POST /api/v1/auth/google
     */
    public function google(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_token' => 'required|string',
        ]);

        $clientId = config('services.google.client_id');
        if (!$clientId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Google sign-in is not configured on the server.',
            ], 503);
        }

        $response = Http::asForm()->get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $validated['id_token'],
        ]);

        if (!$response->ok()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Google ID token.',
            ], 422);
        }

        $payload = $response->json();
        $aud = $payload['aud'] ?? null;
        $email = isset($payload['email']) ? strtolower(trim($payload['email'])) : null;
        $emailVerified = filter_var($payload['email_verified'] ?? false, FILTER_VALIDATE_BOOLEAN)
            || ($payload['email_verified'] ?? null) === 'true';
        $name = $payload['name'] ?? ($payload['given_name'] ?? 'Google User');
        $picture = $payload['picture'] ?? null;

        if (!$aud || $aud !== $clientId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Google token audience mismatch.',
            ], 422);
        }

        if (!$email || !$emailVerified) {
            return response()->json([
                'status' => 'error',
                'message' => 'Google account email must be verified.',
            ], 422);
        }

        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make(Str::random(32)),
                'role' => 'user',
            ]);
            $user->forceFill(['email_verified_at' => now()])->save();
        } elseif (!$user->email_verified_at) {
            $user->forceFill(['email_verified_at' => now()])->save();
        }

        $token = $this->issueToken($user);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => "Customer {$user->name} signed in with Google via Flutter",
            'ip_address' => $request->ip(),
            'payload' => ['email' => $user->email, 'client' => 'flutter', 'provider' => 'google'],
        ]);

        $userPayload = $this->userPayload($user->fresh());
        if (is_string($picture) && $picture !== '') {
            $userPayload['photo_url'] = $picture;
            $userPayload['avatar'] = $picture;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Google sign-in successful.',
            'token' => $token,
            'user' => $userPayload,
        ]);
    }
}

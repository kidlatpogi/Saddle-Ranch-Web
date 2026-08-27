<?php

namespace App\Services;

use App\Mail\OtpCodeMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Throwable;

class EmailOtpService
{
    public const TTL_MINUTES = 10;
    public const MAX_ATTEMPTS = 5;
    public const RESEND_COOLDOWN_SECONDS = 60;

    public function issue(string $email, string $purpose, ?User $user = null): string
    {
        $email = strtolower(trim($email));
        $code = (string) random_int(100000, 999999);

        EmailOtp::where('email', $email)->where('purpose', $purpose)->delete();

        EmailOtp::create([
            'email' => $email,
            'code_hash' => Hash::make($code),
            'purpose' => $purpose,
            'attempts' => 0,
            'expires_at' => now()->addMinutes(self::TTL_MINUTES),
        ]);

        $name = $user?->name ?? 'Customer';

        try {
            Mail::to($email)->send(new OtpCodeMail($code, $purpose, $name));
        } catch (Throwable $e) {
            // Keep OTP usable even when SMTP/DNS fails — do not fail register/login.
            Log::warning('OTP email send failed; code still stored.', [
                'email' => $email,
                'purpose' => $purpose,
                'error' => $e->getMessage(),
            ]);
        }

        return $code;
    }

    /**
     * Seconds remaining before another code can be sent for this email/purpose.
     */
    public function resendCooldownSeconds(string $email, string $purpose): int
    {
        $email = strtolower(trim($email));
        $latest = EmailOtp::where('email', $email)
            ->where('purpose', $purpose)
            ->latest('id')
            ->first();

        if (!$latest) {
            return 0;
        }

        $elapsed = $latest->created_at->diffInSeconds(now());
        $remaining = self::RESEND_COOLDOWN_SECONDS - (int) $elapsed;

        return max(0, $remaining);
    }

    public function assertResendAllowed(string $email, string $purpose): void
    {
        $wait = $this->resendCooldownSeconds($email, $purpose);

        if ($wait > 0) {
            throw ValidationException::withMessages([
                'email' => "Please wait {$wait} seconds before requesting a new code.",
            ])->status(429);
        }
    }

    public function verify(string $email, string $purpose, string $code): void
    {
        $email = strtolower(trim($email));
        $otp = EmailOtp::where('email', $email)
            ->where('purpose', $purpose)
            ->latest('id')
            ->first();

        if (!$otp) {
            throw ValidationException::withMessages([
                'code' => 'No verification code found. Please request a new one.',
            ]);
        }

        if ($otp->isExpired()) {
            $otp->delete();
            throw ValidationException::withMessages([
                'code' => 'This code has expired. Please request a new one.',
            ]);
        }

        if ($otp->attempts >= self::MAX_ATTEMPTS) {
            $otp->delete();
            throw ValidationException::withMessages([
                'code' => 'Too many invalid attempts. Please request a new code.',
            ]);
        }

        if (!Hash::check($code, $otp->code_hash)) {
            $otp->increment('attempts');
            throw ValidationException::withMessages([
                'code' => 'Invalid verification code.',
            ]);
        }

        EmailOtp::where('email', $email)->where('purpose', $purpose)->delete();
    }
}

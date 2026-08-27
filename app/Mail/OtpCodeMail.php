<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public string $purpose,
        public string $recipientName = 'Customer',
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->purpose === 'reset'
            ? 'Your Saddle Ranch password reset code'
            : 'Your Saddle Ranch verification code';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        $action = $this->purpose === 'reset'
            ? 'reset your password'
            : 'verify your email account';

        $name = e($this->recipientName);
        $code = e($this->code);

        return <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Saddle Ranch OTP</title></head>
<body style="font-family: Georgia, serif; background:#111; color:#f5f5f5; padding:32px;">
  <div style="max-width:480px;margin:0 auto;background:#1a1a1b;border:1px solid #534434;border-radius:16px;padding:28px;">
    <h1 style="color:#f59e0b;font-size:22px;margin:0 0 12px;">Saddle Ranch</h1>
    <p style="color:#d8c3ad;margin:0 0 16px;">Hi {$name},</p>
    <p style="color:#d8c3ad;margin:0 0 20px;">Use this 6-digit code to {$action}:</p>
    <p style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#fff;margin:0 0 20px;text-align:center;">{$code}</p>
    <p style="color:#8c7a6b;font-size:13px;margin:0;">This code expires in 10 minutes. If you did not request this, you can ignore this email.</p>
  </div>
</body>
</html>
HTML;
    }
}

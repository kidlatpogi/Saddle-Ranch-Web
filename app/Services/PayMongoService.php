<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PayMongoService
{
    /**
     * Whether this payment method should open a PayMongo Checkout Session.
     */
    public function requiresCheckout(string $paymentMethod): bool
    {
        $payMethod = strtolower($paymentMethod);

        if (str_contains($payMethod, 'cash') && ! str_contains($payMethod, 'wallet')) {
            return false;
        }

        return str_contains($payMethod, 'paymongo')
            || str_contains($payMethod, 'qrph')
            || str_contains($payMethod, 'wallet')
            || str_contains($payMethod, 'online')
            || str_contains($payMethod, 'gcash')
            || str_contains($payMethod, 'maya')
            || str_contains($payMethod, 'paymaya')
            || str_contains($payMethod, 'card');
    }

    /**
     * Create a hosted Checkout Session and return the checkout URL, or null on failure / missing key.
     */
    public function createCheckoutSession(Order $order, ?string $successUrl = null, ?string $cancelUrl = null): ?string
    {
        $secretKey = config('services.paymongo.secret_key')
            ?: config('services.paymongo.secret')
            ?: env('PAYMONGO_SECRET_KEY');
        if (! $secretKey) {
            Log::warning('PayMongo secret key is not configured.');

            return null;
        }

        $order->loadMissing('orderItems.product');

        $lineItems = [];
        foreach ($order->orderItems as $item) {
            $lineItems[] = [
                'currency' => 'PHP',
                'amount' => (int) round(((float) $item->unit_price) * 100),
                'description' => $item->product->description ?? $item->product->name,
                'name' => $item->product->name,
                'quantity' => (int) $item->quantity,
            ];
        }

        if ($lineItems === []) {
            $lineItems[] = [
                'currency' => 'PHP',
                'amount' => (int) round(((float) $order->total_amount) * 100),
                'description' => 'Saddle Ranch Order #'.$order->order_number,
                'name' => 'Order #'.$order->order_number,
                'quantity' => 1,
            ];
        }

        $appUrl = rtrim((string) config('app.url'), '/');
        $successUrl ??= $appUrl.'/order?success=1&order_number='.$order->order_number;
        $cancelUrl ??= $appUrl.'/order?cancelled=1&order_number='.$order->order_number;

        try {
            $response = Http::withOptions([
                'curl' => [
                    CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                ],
                'timeout' => 25,
                'connect_timeout' => 10,
            ])
                ->retry(3, 250, function ($exception) {
                    return $exception instanceof \Illuminate\Http\Client\ConnectionException
                        || ($exception instanceof \Exception && str_contains($exception->getMessage(), 'cURL error'));
                }, throw: false)
                ->withHeaders([
                    'Authorization' => 'Basic '.base64_encode($secretKey.':'),
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post('https://api.paymongo.com/v1/checkout_sessions', [
                    'data' => [
                        'attributes' => [
                            'send_email_receipt' => true,
                            'show_description' => true,
                            'show_line_items' => true,
                            'cancel_url' => $cancelUrl,
                            'success_url' => $successUrl,
                            'payment_method_types' => ['qrph', 'gcash', 'paymaya', 'card'],
                            'line_items' => $lineItems,
                            'description' => 'Saddle Ranch Order #'.$order->order_number,
                            'reference_number' => $order->order_number,
                        ],
                    ],
                ]);

            if ($response->successful()) {
                return $response->json('data.attributes.checkout_url');
            }

            Log::error('PayMongo Checkout Session Error: '.$response->body());
        } catch (\Throwable $e) {
            Log::error('PayMongo Request Exception: '.$e->getMessage());
        }

        return null;
    }
}

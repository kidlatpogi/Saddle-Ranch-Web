<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Saddle Ranch Roadhouse') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Primary SEO Meta Tags -->
        <meta name="description" content="Saddle Ranch Roadhouse — Sizzling steaks, authentic Filipino cuisine, and American smokehouse favorites in Cavite. Experience seamless online ordering, contactless QR table dining, and fast delivery.">
        <meta name="keywords" content="Saddle Ranch, Saddle Ranch Roadhouse, steakhouse Cavite, Silang steakhouse, Filipino food, QR code ordering, dine-in QR, food delivery Bulihan, sizzling sisig, tapsilog, steak platters">
        <meta name="author" content="Saddle Ranch Roadhouse">
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
        <meta name="theme-color" content="#121213">
        <meta name="color-scheme" content="dark">

        <!-- Mobile & PWA Optimization -->
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="Saddle Ranch">
        <meta name="format-detection" content="telephone=no">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:site_name" content="Saddle Ranch Roadhouse">
        <meta property="og:title" content="Saddle Ranch Roadhouse — Western Smokehouse & Filipino Sizzlers">
        <meta property="og:description" content="Premium steaks, sizzlers, and homestyle Filipino dishes in Cavite. Order online for pickup/delivery or scan your table QR code for instant dine-in service.">
        <meta property="og:image" content="{{ asset('images/saddle_ranch_logo.png') }}">
        <meta property="og:image:alt" content="Saddle Ranch Roadhouse Logo">
        <meta property="og:locale" content="en_PH">

        <!-- Twitter Cards -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="Saddle Ranch Roadhouse — Western Smokehouse & Filipino Sizzlers">
        <meta name="twitter:description" content="Premium steaks, sizzlers, and homestyle Filipino dishes in Cavite. Fast QR Dine-In & Delivery.">
        <meta name="twitter:image" content="{{ asset('images/saddle_ranch_logo.png') }}">

        <!-- Browser Tab Logo / Favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/favicon.png">

        <!-- JSON-LD Structured Data: Schema.org Restaurant -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Saddle Ranch Roadhouse",
            "image": "{{ asset('images/saddle_ranch_logo.png') }}",
            "description": "Saddle Ranch Roadhouse serves western sizzling steaks, homestyle Filipino platters, and specialty beverages in Cavite with contactless QR dine-in and online ordering.",
            "servesCuisine": [
                "American Steakhouse",
                "Filipino",
                "Sizzling Dishes",
                "Barbecue"
            ],
            "priceRange": "₱₱",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Silang",
                "addressRegion": "Cavite",
                "addressCountry": "PH"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": 14.2312,
                "longitude": 120.9744
            },
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "opens": "10:00",
                    "closes": "22:00"
                }
            ],
            "hasMenu": "{{ url('/order') }}",
            "acceptsReservations": "False"
        }
        </script>

        <!-- Google Fonts: Domine, Work Sans, JetBrains Mono -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Domine:wght@400..700&family=JetBrains+Mono:wght@100..800&family=Work+Sans:wght@100..900&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-[#121213] text-[#f0e0d1] overflow-x-hidden">
        @inertia
    </body>
</html>

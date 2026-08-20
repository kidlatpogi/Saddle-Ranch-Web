<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Saddle Ranch') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Browser Tab Logo / Favicon -->
        <link rel="icon" type="image/png" href="/saddle_ranch_logo.png">
        <link rel="shortcut icon" type="image/png" href="/saddle_ranch_logo.png">
        <link rel="apple-touch-icon" href="/saddle_ranch_logo.png">

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

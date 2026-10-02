<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class QrGeneratorController extends Controller
{
    public function index(): Response
    {
        $baseUrl = request()->getSchemeAndHttpHost();
        $branch = request()->query('branch', 'Dasma');
        $branchKey = str_contains(strtolower($branch), 'bulihan') ? 'Bulihan' : 'Dasma';
        $prefix = $branchKey === 'Dasma' ? 'D-' : 'B-';

        $tables = [];
        for ($i = 1; $i <= 25; $i++) {
            $num = str_pad($i, 2, '0', STR_PAD_LEFT);
            $tables[] = [
                'table_number' => "{$prefix}{$num}",
                'label' => "{$branchKey} Table {$num}",
                'qr_url' => "{$baseUrl}/dine-in?table={$prefix}{$num}&branch={$branchKey}",
            ];
        }

        $tables[] = [
            'table_number' => 'EXPRESS',
            'label' => 'Express Takeout Counter',
            'qr_url' => "{$baseUrl}/order?branch={$branchKey}",
        ];

        return Inertia::render('Admin/QrGenerator', [
            'tables' => $tables,
            'currentBranch' => $branchKey,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class QrGeneratorController extends Controller
{
    public function index(): Response
    {
        $tables = [];
        for ($i = 1; $i <= 25; $i++) {
            $num = str_pad($i, 2, '0', STR_PAD_LEFT);
            $tables[] = [
                'table_number' => $num,
                'label' => "Table {$num}",
                'qr_url' => url("/dine-in?table={$num}"),
            ];
        }

        $tables[] = [
            'table_number' => 'EXPRESS',
            'label' => 'Express Takeout Counter',
            'qr_url' => url('/order'),
        ];

        return Inertia::render('Admin/QrGenerator', [
            'tables' => $tables,
        ]);
    }
}

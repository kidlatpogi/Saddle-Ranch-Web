<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Customer Routes
Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/order', [OrderController::class, 'order'])->name('order');
Route::get('/dine-in', [OrderController::class, 'dineIn'])->name('dine-in');
Route::post('/order/checkout', [OrderController::class, 'checkout'])->name('order.checkout');

// Public/API fallback routes for order updates & cancellations
Route::patch('/orders/{id}/status', [EmployeeController::class, 'updateStatus'])->name('orders.update-status');
Route::post('/orders/{id}/cancel', [EmployeeController::class, 'cancel'])->name('orders.cancel');

// Protected Employee & Admin Routes
Route::middleware(['auth', 'role:admin,employee'])->group(function () {
    Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->name('employee.dashboard');
    Route::get('/employee/kitchen', [EmployeeController::class, 'kitchen'])->name('employee.kitchen');
});

// Protected Admin Route
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

// Default Dashboard Redirect
Route::get('/dashboard', function () {
    if (auth()->user()?->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('employee.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

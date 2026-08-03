<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\EmployeeAccountController;
use App\Http\Controllers\Admin\ProductManagementController;
use App\Http\Controllers\Admin\PromoBannerController;
use App\Http\Controllers\Admin\QrGeneratorController;
use App\Http\Controllers\Admin\SalesAnalyticsController;
use App\Http\Controllers\Admin\VoucherController;
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

// Public/API fallback routes for order status updates & cancellations
Route::patch('/orders/{id}/status', [EmployeeController::class, 'updateStatus'])->name('orders.update-status');
Route::post('/orders/{id}/cancel', [EmployeeController::class, 'cancel'])->name('orders.cancel');

// Protected Employee & Cashier Routes
Route::middleware(['auth', 'role:admin,employee,cashier,kitchen'])->group(function () {
    Route::get('/employee/dashboard', [EmployeeController::class, 'dashboard'])->name('employee.dashboard');
    Route::get('/employee/kitchen', [EmployeeController::class, 'kitchen'])->name('employee.kitchen');
});

// Protected Admin Routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    
    // Product Management (CRUD)
    Route::get('/admin/products', [ProductManagementController::class, 'index'])->name('admin.products');
    Route::post('/admin/products', [ProductManagementController::class, 'store'])->name('admin.products.store');
    Route::post('/admin/products/{id}', [ProductManagementController::class, 'update'])->name('admin.products.update');
    Route::delete('/admin/products/{id}', [ProductManagementController::class, 'destroy'])->name('admin.products.destroy');

    // Promo Banners & Vouchers CRUD
    Route::get('/admin/banners', [PromoBannerController::class, 'index'])->name('admin.banners');
    Route::post('/admin/banners', [PromoBannerController::class, 'store'])->name('admin.banners.store');
    Route::post('/admin/banners/{id}', [PromoBannerController::class, 'update'])->name('admin.banners.update');
    Route::delete('/admin/banners/{id}', [PromoBannerController::class, 'destroy'])->name('admin.banners.destroy');

    Route::get('/admin/vouchers', [VoucherController::class, 'index'])->name('admin.vouchers');
    Route::post('/admin/vouchers', [VoucherController::class, 'store'])->name('admin.vouchers.store');
    Route::delete('/admin/vouchers/{id}', [VoucherController::class, 'destroy'])->name('admin.vouchers.destroy');

    // Staff & Customer Accounts & Roles (Full CRUD)
    Route::get('/admin/employees', [EmployeeAccountController::class, 'index'])->name('admin.employees');
    Route::post('/admin/employees', [EmployeeAccountController::class, 'store'])->name('admin.employees.store');
    Route::post('/admin/employees/{id}', [EmployeeAccountController::class, 'update'])->name('admin.employees.update');
    Route::delete('/admin/employees/{id}', [EmployeeAccountController::class, 'destroy'])->name('admin.employees.destroy');

    // Analytics, QRs & Audit Logs
    Route::get('/admin/sales', [SalesAnalyticsController::class, 'index'])->name('admin.sales');
    Route::get('/admin/qr-generator', [QrGeneratorController::class, 'index'])->name('admin.qr-generator');
    Route::get('/admin/audit-logs', [AuditLogController::class, 'index'])->name('admin.audit-logs');
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

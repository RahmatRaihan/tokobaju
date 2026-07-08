<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CommunityPhotoController as AdminCommunityPhotoController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GalleryImageController as AdminGalleryImageController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordResetOtpController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public storefront
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/catalog', [ProductController::class, 'index'])->name('catalog');
Route::get('/products/{product:slug}/quick-view', [ProductController::class, 'quickView'])->name('products.quick-view');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/community', [CommunityController::class, 'index'])->name('community');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/help', [PageController::class, 'help'])->name('help');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

/*
|--------------------------------------------------------------------------
| Guest auth
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // Forgot password via emailed OTP (3 steps).
    Route::get('/forgot-password', [PasswordResetOtpController::class, 'show'])->name('password.request');
    Route::post('/forgot-password', [PasswordResetOtpController::class, 'requestOtp'])
        ->middleware('throttle:5,1')->name('password.otp.request');
    Route::post('/forgot-password/verify', [PasswordResetOtpController::class, 'verifyOtp'])
        ->middleware('throttle:10,1')->name('password.otp.verify');
    Route::post('/forgot-password/reset', [PasswordResetOtpController::class, 'resetPassword'])
        ->middleware('throttle:10,1')->name('password.otp.reset');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')->name('logout');

/*
|--------------------------------------------------------------------------
| Checkout (requires login) -> WhatsApp
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'create'])->name('checkout.create');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});

/*
|--------------------------------------------------------------------------
| Customer order tracking (requires login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/my-orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/my-orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

/*
|--------------------------------------------------------------------------
| Admin panel (auth + admin role)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('/products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    // POST + _method=PUT so file uploads work through Inertia's multipart form.
    Route::match(['post', 'put'], '/products/{product}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
    Route::delete('/products/{product}/images/{image}', [AdminProductController::class, 'deleteImage'])->name('products.images.destroy');

    // Categories
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');
    Route::delete('/orders/{order}', [AdminOrderController::class, 'destroy'])->name('orders.destroy');

    // Customers
    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');

    // Settings + site content
    Route::get('/settings', [AdminSettingController::class, 'edit'])->name('settings.edit');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');
    Route::post('/community-photos', [AdminCommunityPhotoController::class, 'store'])->name('community.store');
    Route::delete('/community-photos/{communityPhoto}', [AdminCommunityPhotoController::class, 'destroy'])->name('community.destroy');
    Route::post('/gallery-images', [AdminGalleryImageController::class, 'store'])->name('gallery.store');
    Route::delete('/gallery-images/{galleryImage}', [AdminGalleryImageController::class, 'destroy'])->name('gallery.destroy');
});

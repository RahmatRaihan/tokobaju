<?php

namespace App\Http\Middleware;

use App\Models\Order;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'is_admin' => $user->isAdmin(),
                ] : null,
            ],
            'site' => [
                'store_name' => Setting::get('store_name', 'INSKYLXSTR'),
                'whatsapp_number' => Setting::get('whatsapp_number'),
                'instagram_url' => Setting::get('instagram_url'),
                'store_email' => Setting::get('store_email'),
            ],
            // Closures so they resolve AFTER the controller ran — opening the page stamps
            // its *_seen_at, so the badge is already 0 in that same response.
            'new_orders_count' => fn () => $user?->isAdmin()
                ? Order::when($user->orders_seen_at, fn ($q, $seen) => $q->where('created_at', '>', $seen))->count()
                : 0,
            'new_customers_count' => fn () => $user?->isAdmin()
                ? User::where('role', 'customer')
                    ->when($user->customers_seen_at, fn ($q, $seen) => $q->where('created_at', '>', $seen))
                    ->count()
                : 0,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'checkout' => fn () => $request->session()->get('checkout'),
            ],
        ];
    }
}

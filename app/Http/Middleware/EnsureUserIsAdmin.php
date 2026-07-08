<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    private const LAST_SEEN = 'admin_last_activity';

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            abort(403, 'Unauthorized. Admin access only.');
        }

        if ($this->idleTooLong($request)) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')
                ->with('error', 'Sesi admin berakhir karena tidak ada aktivitas. Silakan login kembali.');
        }

        // ponytail: the clock only ticks on /admin requests — browsing the storefront
        // does not keep the admin panel alive. That is the intent: an unattended
        // admin tab logs itself out.
        $request->session()->put(self::LAST_SEEN, now()->timestamp);

        return $next($request);
    }

    private function idleTooLong(Request $request): bool
    {
        $timeout = (int) config('session.admin_idle_timeout');
        $lastSeen = $request->session()->get(self::LAST_SEEN);

        if ($timeout <= 0 || ! $lastSeen) {
            return false;
        }

        return Carbon::createFromTimestamp($lastSeen)->addMinutes($timeout)->isPast();
    }
}

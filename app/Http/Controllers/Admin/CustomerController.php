<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Csv;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        // Read the previous "seen" mark before stamping it, so this page can still
        // highlight which signups are new.
        $seenAt = $request->user()->customers_seen_at;

        $customers = $this->query($request)
            ->paginate(12)
            ->withQueryString();

        $customers->getCollection()->transform(fn (User $u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone,
            'orders_count' => $u->orders_count,
            'joined' => $u->created_at->format('d M Y'),
            'is_new' => $seenAt !== null && $u->created_at->gt($seenAt),
        ]);

        // Mark as seen — the shared `new_customers_count` closure runs after this, so
        // the sidebar badge clears in the very response that renders this page.
        $user = $request->user();
        $user->customers_seen_at = now();
        $user->save();

        return Inertia::render('admin/customers/Index', [
            'customers' => $customers,
            'filters' => ['search' => $request->string('search')->value() ?: ''],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $customers = $this->query($request)->get();

        return Csv::download(
            'customers-'.now()->format('Y-m-d').'.csv',
            ['Name', 'Email', 'Phone', 'Orders', 'Joined'],
            $customers->map(fn (User $u) => [
                $u->name,
                $u->email,
                $u->phone,
                $u->orders_count,
                $u->created_at->format('Y-m-d H:i'),
            ]),
        );
    }

    public function destroy(User $customer): RedirectResponse
    {
        // Route model binding accepts any user id — never let an admin be deleted here.
        abort_if($customer->isAdmin(), 403);

        // Orders keep their snapshotted customer data; the FK is nullOnDelete.
        $customer->delete();

        return back()->with('success', 'Customer deleted.');
    }

    /** Shared listing query so the table and the CSV export stay in sync. */
    private function query(Request $request)
    {
        return User::query()
            ->where('role', 'customer')
            ->withCount('orders')
            ->when($request->string('search')->trim()->value(), fn ($q, $s) => $q
                ->where(fn ($qq) => $qq->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")))
            ->latest();
    }
}

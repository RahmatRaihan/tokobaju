<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->withCount('orders')
            ->when($request->string('search')->trim()->value(), fn ($q, $s) => $q
                ->where(fn ($qq) => $qq->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%")))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $customers->getCollection()->transform(fn (User $u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone,
            'orders_count' => $u->orders_count,
            'joined' => $u->created_at->format('d M Y'),
        ]);

        return Inertia::render('admin/customers/Index', [
            'customers' => $customers,
            'filters' => ['search' => $request->string('search')->value() ?: ''],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalSales = Order::where('status', '!=', 'cancelled')->sum('total');

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_sales' => (int) $totalSales,
                'total_sales_formatted' => format_rupiah((int) $totalSales),
                'orders_count' => Order::count(),
                'customers_count' => User::where('role', 'customer')->count(),
                'products_count' => Product::count(),
            ],
            'recent_orders' => Order::latest()->take(5)->get()->map(fn (Order $o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer_name' => $o->customer_name,
                'total_formatted' => $o->total_formatted,
                'status' => $o->status,
                'created_at' => $o->created_at->format('d M Y'),
            ]),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Support\Csv;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardController extends Controller
{
    private const MONTHS = 12;

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
            'sales_by_month' => $this->salesByMonth(),
            'orders_by_status' => Order::selectRaw('status, COUNT(*) as c')->groupBy('status')->pluck('c', 'status'),
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

    /** Revenue for the last 12 months, zero-filled so the bar chart never has gaps. */
    private function salesByMonth(): array
    {
        $start = now()->subMonths(self::MONTHS - 1)->startOfMonth();

        $totals = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $start)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as ym, SUM(total) as total")
            ->groupBy('ym')
            ->pluck('total', 'ym');

        return collect(range(0, self::MONTHS - 1))
            ->map(function (int $i) use ($start, $totals) {
                $m = $start->copy()->addMonths($i);
                $ym = $m->format('Y-m');

                return [
                    'ym' => $ym,
                    'label' => $m->format('M y'),
                    'total' => (int) ($totals[$ym] ?? 0),
                ];
            })
            ->all();
    }

    public function exportOrders(Request $request): StreamedResponse
    {
        $month = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
        ])['month'];

        $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        $orders = Order::with('items:id,order_id,product_name,variant_label,quantity')
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('id')
            ->get();

        return Csv::download(
            "orders-{$month}.csv",
            ['Order Number', 'Date', 'Customer', 'Phone', 'Email', 'Province', 'City', 'Address', 'Items', 'Status', 'Subtotal', 'Total'],
            $orders->map(fn (Order $o) => [
                $o->order_number,
                $o->created_at->format('Y-m-d H:i'),
                $o->customer_name,
                $o->customer_phone,
                $o->customer_email,
                $o->province,
                $o->city,
                $o->shipping_address,
                $o->items->map(fn ($i) => "{$i->product_name} ({$i->variant_label}) x{$i->quantity}")->implode('; '),
                $o->status,
                $o->subtotal,
                $o->total,
            ]),
        );
    }
}

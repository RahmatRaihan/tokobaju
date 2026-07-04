<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * List the logged-in customer's own orders.
     */
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->withCount('items')
            ->latest()
            ->paginate(10)
            ->through(fn (Order $o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'status' => $o->status,
                'total_formatted' => $o->total_formatted,
                'items_count' => $o->items_count,
                'created_at' => $o->created_at->format('d M Y, H:i'),
            ]);

        return Inertia::render('orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show one of the customer's orders — with a guard so they can only
     * ever see their own.
     */
    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load('items');

        return Inertia::render('orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'shipping_address' => $order->shipping_address,
                'notes' => $order->notes,
                'subtotal_formatted' => format_rupiah($order->subtotal),
                'total_formatted' => $order->total_formatted,
                'created_at' => $order->created_at->format('d M Y, H:i'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_label' => $item->variant_label,
                    'unit_price_formatted' => format_rupiah($item->unit_price),
                    'quantity' => $item->quantity,
                    'line_total_formatted' => format_rupiah($item->line_total),
                ]),
            ],
        ]);
    }
}

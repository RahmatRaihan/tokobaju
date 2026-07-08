<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        // Read the previous "seen" mark before stamping it, so this page can still
        // highlight which rows are the new ones.
        $seenAt = $request->user()->orders_seen_at;

        $orders = Order::query()
            ->withCount('items')
            ->when($request->string('status')->value(), fn ($q, $s) => $q->where('status', $s))
            ->when($request->string('search')->trim()->value(), fn ($q, $s) => $q
                ->where(fn ($qq) => $qq->where('order_number', 'like', "%{$s}%")
                    ->orWhere('customer_name', 'like', "%{$s}%")))
            ->latest()
            ->paginate(12)
            ->withQueryString();

        $orders->getCollection()->transform(fn (Order $o) => [
            'id' => $o->id,
            'order_number' => $o->order_number,
            'customer_name' => $o->customer_name,
            'customer_phone' => $o->customer_phone,
            'total_formatted' => $o->total_formatted,
            'status' => $o->status,
            'items_count' => $o->items_count,
            'created_at' => $o->created_at->format('d M Y H:i'),
            'is_new' => $seenAt !== null && $o->created_at->gt($seenAt),
        ]);

        // Mark as seen — the shared `new_orders_count` closure runs after this, so the
        // sidebar badge clears in the very response that renders this page.
        $user = $request->user();
        $user->orders_seen_at = now();
        $user->save();

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'statuses' => Order::STATUSES,
            'filters' => [
                'status' => $request->string('status')->value() ?: '',
                'search' => $request->string('search')->value() ?: '',
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('items');

        return Inertia::render('admin/orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'shipping_address' => $order->shipping_address,
                'city' => $order->city,
                'province' => $order->province,
                'postal_code' => $order->postal_code,
                'notes' => $order->notes,
                'status' => $order->status,
                'subtotal_formatted' => format_rupiah($order->subtotal),
                'total_formatted' => $order->total_formatted,
                'created_at' => $order->created_at->format('d M Y H:i'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'variant_label' => $item->variant_label,
                    'unit_price_formatted' => format_rupiah($item->unit_price),
                    'quantity' => $item->quantity,
                    'line_total_formatted' => format_rupiah($item->line_total),
                ]),
            ],
            'statuses' => Order::STATUSES,
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:'.implode(',', Order::STATUSES)],
        ]);

        $newStatus = $data['status'];
        $oldStatus = $order->status;

        DB::transaction(function () use ($order, $newStatus, $oldStatus) {
            // Decrement stock when an order first moves into processing (confirmed).
            if ($newStatus === 'processing' && $oldStatus === 'pending') {
                foreach ($order->items as $item) {
                    if ($item->product_variant_id) {
                        $item->variant()->where('stock', '>=', $item->quantity)
                            ->decrement('stock', $item->quantity);
                    }
                }
            }

            $order->update(['status' => $newStatus]);
        });

        return back()->with('success', "Order status updated to {$newStatus}.");
    }

    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Order deleted.');
    }
}

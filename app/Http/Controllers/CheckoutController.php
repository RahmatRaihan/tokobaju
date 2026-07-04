<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    /**
     * Validate the cart against the DB, persist the order + snapshot items,
     * and hand back a wa.me URL for the customer to chat the admin.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'shipping_address' => ['nullable', 'string', 'max:1000'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $variantIds = collect($data['items'])->pluck('variant_id');
            $variants = ProductVariant::with('product')
                ->whereIn('id', $variantIds)
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            $subtotal = 0;
            $orderItems = [];

            foreach ($data['items'] as $line) {
                $variant = $variants->get($line['variant_id']);

                if (! $variant || ! $variant->is_active || ! $variant->product || ! $variant->product->is_active) {
                    throw ValidationException::withMessages([
                        'items' => 'One or more items are no longer available.',
                    ]);
                }

                if ($variant->stock < $line['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for {$variant->product->name} ({$variant->label}). Only {$variant->stock} left.",
                    ]);
                }

                $unitPrice = $variant->effectivePrice();
                $lineTotal = $unitPrice * $line['quantity'];
                $subtotal += $lineTotal;

                $orderItems[] = [
                    'product_id' => $variant->product_id,
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_label' => $variant->label,
                    'unit_price' => $unitPrice,
                    'quantity' => $line['quantity'],
                    'line_total' => $lineTotal,
                ];
            }

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $request->user()?->id,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'shipping_address' => $data['shipping_address'] ?? null,
                'notes' => $data['notes'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'status' => 'pending',
                'whatsapp_sent_at' => now(),
            ]);

            $order->items()->createMany($orderItems);

            return $order->load('items');
        });

        $waUrl = $this->buildWhatsAppUrl($order);

        return back()->with('checkout', [
            'order_number' => $order->order_number,
            'whatsapp_url' => $waUrl,
        ]);
    }

    private function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $countToday = Order::whereDate('created_at', now()->toDateString())->count() + 1;

        return sprintf('ORD-%s-%04d', $date, $countToday);
    }

    private function buildWhatsAppUrl(Order $order): string
    {
        $number = preg_replace('/\D/', '', (string) Setting::get('whatsapp_number', ''));

        $lines = [];
        $lines[] = 'Halo INSKYLXSTR, saya mau order:';
        $lines[] = '';
        $lines[] = "No. Order: {$order->order_number}";
        foreach ($order->items as $item) {
            $label = $item->variant_label ? " ({$item->variant_label})" : '';
            $lines[] = "- {$item->product_name}{$label} x{$item->quantity} = ".format_rupiah($item->line_total);
        }
        $lines[] = '';
        $lines[] = 'Total: '.format_rupiah($order->total);
        $lines[] = '';
        $lines[] = "Nama: {$order->customer_name}";
        $lines[] = "No. HP: {$order->customer_phone}";
        if ($order->shipping_address) {
            $lines[] = "Alamat: {$order->shipping_address}";
        }
        if ($order->notes) {
            $lines[] = "Catatan: {$order->notes}";
        }

        $text = rawurlencode(implode("\n", $lines));

        return "https://wa.me/{$number}?text={$text}";
    }
}

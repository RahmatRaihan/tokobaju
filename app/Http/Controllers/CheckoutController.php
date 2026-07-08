<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderMail;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    /**
     * Show the dedicated checkout page. The cart itself lives client-side
     * (localStorage); this page reads it on the client and renders the form.
     */
    public function create(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Checkout', [
            'prefill' => [
                'name' => $user?->name ?? '',
                'phone' => $user?->phone ?? '',
                'email' => $user?->email ?? '',
            ],
        ]);
    }

    /**
     * Validate the cart against the DB, persist the order + snapshot items,
     * and hand back a wa.me URL for the customer to chat the admin.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'shipping_address' => ['required', 'string', 'max:1000'],
            'province' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
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
                'customer_email' => $data['customer_email'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'province' => $data['province'],
                'city' => $data['city'],
                'postal_code' => $data['postal_code'] ?? null,
                'notes' => $data['notes'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'status' => 'pending',
                'whatsapp_sent_at' => now(),
            ]);

            $order->items()->createMany($orderItems);

            return $order->load('items');
        });

        $this->notifyAdmin($order);

        $waUrl = $this->buildWhatsAppUrl($order);

        // Go to the customer's order detail page, passing the WhatsApp URL so
        // the frontend can open it in a new tab.
        return redirect()->route('orders.show', $order)->with('checkout', [
            'order_number' => $order->order_number,
            'whatsapp_url' => $waUrl,
        ]);
    }

    /**
     * Email the shop owner that an order landed. Queued, so a slow or dead SMTP
     * server never delays checkout — and wrapped, so it can never lose the order
     * the customer just placed.
     */
    private function notifyAdmin(Order $order): void
    {
        $to = Setting::get('store_email') ?: config('mail.from.address');

        if (! $to) {
            return;
        }

        try {
            Mail::to($to)->queue(new NewOrderMail($order));
        } catch (\Throwable $e) {
            Log::error('Failed to queue new-order notification', [
                'order_id' => $order->id,
                'exception' => $e->getMessage(),
            ]);
        }
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
        $lines[] = 'Tanggal: '.$order->created_at->format('d M Y, H:i');
        $lines[] = '';
        $lines[] = '*DETAIL PESANAN*';

        $totalQty = 0;

        foreach ($order->items as $i => $item) {
            $totalQty += $item->quantity;

            $lines[] = ($i + 1).". {$item->product_name}";
            // Seeded single-variant products carry the placeholder label "Default".
            if ($item->variant_label && $item->variant_label !== 'Default') {
                $lines[] = "   Varian: {$item->variant_label}";
            }
            $lines[] = "   Jumlah: {$item->quantity} x ".format_rupiah($item->unit_price);
            $lines[] = '   Subtotal: '.format_rupiah($item->line_total);
        }

        $lines[] = '';
        $lines[] = "*Total ({$totalQty} item): ".format_rupiah($order->total).'*';
        $lines[] = '';
        $lines[] = '*DATA PENGIRIMAN*';
        $lines[] = "Nama: {$order->customer_name}";
        $lines[] = "No. HP: {$order->customer_phone}";
        if ($order->customer_email) {
            $lines[] = "Email: {$order->customer_email}";
        }
        $lines[] = "Alamat: {$order->shipping_address}";
        $lines[] = "Kota: {$order->city}";
        $lines[] = "Provinsi: {$order->province}";
        if ($order->postal_code) {
            $lines[] = "Kode Pos: {$order->postal_code}";
        }
        if ($order->notes) {
            $lines[] = "Catatan: {$order->notes}";
        }

        $text = rawurlencode(implode("\n", $lines));

        return "https://wa.me/{$number}?text={$text}";
    }
}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background:#f4f4f5; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5; padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5e5;">
                    <tr>
                        <td style="background:#111111; padding:24px 32px;">
                            <span style="color:#ffffff; font-size:22px; font-weight:900; font-style:italic; letter-spacing:-1px; text-transform:uppercase;">INSKYLXSTR</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 4px; font-size:20px; color:#111;">Pesanan baru masuk</h1>
                            <p style="margin:0 0 24px; font-size:14px; color:#555;">
                                <strong>{{ $order->order_number }}</strong> &middot; {{ $order->created_at->format('d M Y H:i') }}
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#333; margin:0 0 24px;">
                                <tr><td style="padding:4px 0; color:#888; width:110px;">Nama</td><td style="padding:4px 0;">{{ $order->customer_name }}</td></tr>
                                <tr><td style="padding:4px 0; color:#888;">No. HP</td><td style="padding:4px 0;">{{ $order->customer_phone }}</td></tr>
                                @if ($order->customer_email)
                                    <tr><td style="padding:4px 0; color:#888;">Email</td><td style="padding:4px 0;">{{ $order->customer_email }}</td></tr>
                                @endif
                                <tr>
                                    <td style="padding:4px 0; color:#888; vertical-align:top;">Alamat</td>
                                    <td style="padding:4px 0;">
                                        {{ $order->shipping_address }}<br>
                                        {{ collect([$order->city, $order->province, $order->postal_code])->filter()->implode(', ') }}
                                    </td>
                                </tr>
                                @if ($order->notes)
                                    <tr><td style="padding:4px 0; color:#888; vertical-align:top;">Catatan</td><td style="padding:4px 0;">{{ $order->notes }}</td></tr>
                                @endif
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; border-top:1px solid #eee;">
                                @foreach ($order->items as $item)
                                    <tr>
                                        <td style="padding:10px 0; border-bottom:1px solid #f2f2f2;">
                                            {{ $item->product_name }}
                                            @if ($item->variant_label)
                                                <span style="color:#888;">({{ $item->variant_label }})</span>
                                            @endif
                                            <span style="color:#888;">&times;{{ $item->quantity }}</span>
                                        </td>
                                        <td align="right" style="padding:10px 0; border-bottom:1px solid #f2f2f2; white-space:nowrap;">
                                            {{ format_rupiah($item->line_total) }}
                                        </td>
                                    </tr>
                                @endforeach
                                <tr>
                                    <td style="padding:14px 0; font-weight:bold;">Total</td>
                                    <td align="right" style="padding:14px 0; font-weight:bold; font-size:16px;">{{ format_rupiah($order->total) }}</td>
                                </tr>
                            </table>

                            <div style="text-align:center; margin:24px 0 0;">
                                <a href="{{ $adminUrl }}" style="display:inline-block; background:#111; color:#fff; text-decoration:none; font-weight:bold; font-size:14px; padding:14px 28px; border-radius:8px;">
                                    Buka di Admin Panel
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 32px; border-top:1px solid #eee;">
                            <p style="margin:0; font-size:12px; color:#aaa;">&copy; {{ date('Y') }} INSKYLXSTR — Pontianak, Indonesia</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

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
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e5e5;">
                    <tr>
                        <td style="background:#111111; padding:24px 32px;">
                            <span style="color:#ffffff; font-size:22px; font-weight:900; font-style:italic; letter-spacing:-1px; text-transform:uppercase;">INSKYLXSTR</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 12px; font-size:20px; color:#111;">Password reset code</h1>
                            <p style="margin:0 0 24px; font-size:14px; color:#555; line-height:1.6;">
                                Use the code below to reset your password. If you didn't request this, you can safely ignore this email.
                            </p>

                            <div style="text-align:center; margin:0 0 24px;">
                                <span style="display:inline-block; font-size:34px; font-weight:800; letter-spacing:10px; color:#111; background:#f4f4f5; border:1px solid #e5e5e5; border-radius:10px; padding:16px 24px;">
                                    {{ $code }}
                                </span>
                            </div>

                            <p style="margin:0; font-size:13px; color:#888; line-height:1.6;">
                                This code expires in <strong>{{ $expiresMinutes }} minutes</strong>. For your security, never share it with anyone.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:16px 32px; border-top:1px solid #eee;">
                            <p style="margin:0; font-size:12px; color:#aaa;">&copy; {{ date('Y') }} INSKYLXSTR — Jakarta, Indonesia</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

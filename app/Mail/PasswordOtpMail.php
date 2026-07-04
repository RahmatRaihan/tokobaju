<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public int $expiresMinutes,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your INSKYLXSTR password reset code',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.password-otp',
            with: [
                'code' => $this->code,
                'expiresMinutes' => $this->expiresMinutes,
            ],
        );
    }
}

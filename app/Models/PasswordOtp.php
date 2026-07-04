<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['email', 'code_hash', 'expires_at', 'attempts', 'verified'])]
class PasswordOtp extends Model
{
    /** Max wrong attempts before the OTP is invalidated. */
    public const MAX_ATTEMPTS = 5;

    /** How long a verified OTP stays usable to actually reset the password. */
    public const VERIFIED_WINDOW_MINUTES = 10;

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'attempts' => 'integer',
            'verified' => 'boolean',
        ];
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }
}

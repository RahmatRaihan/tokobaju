<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\PasswordOtpMail;
use App\Models\PasswordOtp;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetOtpController extends Controller
{
    private const OTP_TTL_MINUTES = 10;

    public function show(): Response
    {
        return Inertia::render('auth/ForgotPassword');
    }

    /**
     * Step 1 — user submits their email; we generate an OTP and email it.
     * The response is intentionally the same whether or not the email exists,
     * so attackers can't use this to discover registered accounts.
     */
    public function requestOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $email = mb_strtolower($request->string('email')->trim()->value());
        $user = User::where('email', $email)->first();

        if ($user) {
            // Clear any previous OTPs for this email, then issue a fresh one.
            PasswordOtp::where('email', $email)->delete();

            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            PasswordOtp::create([
                'email' => $email,
                'code_hash' => Hash::make($code),
                'expires_at' => now()->addMinutes(self::OTP_TTL_MINUTES),
                'attempts' => 0,
                'verified' => false,
            ]);

            Mail::to($email)->send(new PasswordOtpMail($code, self::OTP_TTL_MINUTES));
        }

        return back()->with('success', 'If that email is registered, a verification code has been sent.');
    }

    /**
     * Step 2 — user submits the 6-digit code. We verify it (hashed compare),
     * enforcing expiry and a max-attempts limit.
     */
    public function verifyOtp(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'code' => ['required', 'string', 'digits:6'],
        ]);

        $email = mb_strtolower($request->string('email')->trim()->value());
        $otp = PasswordOtp::where('email', $email)->latest()->first();

        $this->assertUsableOtp($otp);

        if (! Hash::check($request->string('code')->value(), $otp->code_hash)) {
            $otp->increment('attempts');

            throw ValidationException::withMessages([
                'code' => 'The verification code is incorrect.',
            ]);
        }

        // Mark verified and extend the window so the user has time to set a new password.
        $otp->update([
            'verified' => true,
            'expires_at' => now()->addMinutes(PasswordOtp::VERIFIED_WINDOW_MINUTES),
        ]);

        return back()->with('success', 'Code verified. You can now set a new password.');
    }

    /**
     * Step 3 — with a verified OTP, set the new password.
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'code' => ['required', 'string', 'digits:6'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $email = mb_strtolower($request->string('email')->trim()->value());
        $otp = PasswordOtp::where('email', $email)->latest()->first();

        $this->assertUsableOtp($otp);

        // Re-check the code and require it to have been verified in step 2.
        if (! $otp->verified || ! Hash::check($request->string('code')->value(), $otp->code_hash)) {
            throw ValidationException::withMessages([
                'code' => 'Please verify your code again.',
            ]);
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            throw ValidationException::withMessages(['email' => 'Account not found.']);
        }

        $user->update(['password' => Hash::make($request->string('password')->value())]);

        // OTP is single-use — remove it once the password is changed.
        PasswordOtp::where('email', $email)->delete();

        return redirect()->route('login')->with('success', 'Password reset successfully. Please sign in.');
    }

    /**
     * Guard shared by verify + reset: OTP must exist, be unexpired, and under the attempt cap.
     */
    private function assertUsableOtp(?PasswordOtp $otp): void
    {
        if (! $otp || $otp->isExpired()) {
            throw ValidationException::withMessages([
                'code' => 'The code has expired. Please request a new one.',
            ]);
        }

        if ($otp->attempts >= PasswordOtp::MAX_ATTEMPTS) {
            throw ValidationException::withMessages([
                'code' => 'Too many attempts. Please request a new code.',
            ]);
        }
    }
}

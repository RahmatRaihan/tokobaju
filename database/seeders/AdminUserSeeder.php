<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin credentials come from env so production never ships a known password.
        // Set ADMIN_EMAIL / ADMIN_PASSWORD in .env before seeding on the server.
        $adminEmail = env('ADMIN_EMAIL', 'admin@inskylxstr.test');
        $adminPassword = env('ADMIN_PASSWORD');

        // In production, generate a random password if none is provided, and print it
        // once so it can be recorded (never a hardcoded default).
        if (! $adminPassword) {
            $adminPassword = app()->environment('production') ? Str::password(16) : 'password';
        }

        $admin = User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('ADMIN_NAME', 'INSKYLXSTR Admin'),
                'password' => Hash::make($adminPassword),
                'role' => 'admin',
                'phone' => env('ADMIN_PHONE', '6281234567890'),
                'email_verified_at' => now(),
            ]
        );

        if (app()->environment('production') && ! env('ADMIN_PASSWORD')) {
            $this->command?->warn("Admin created: {$admin->email}");
            $this->command?->warn("Generated admin password (save it now!): {$adminPassword}");
        }

        // Demo customer only outside production.
        if (! app()->environment('production')) {
            User::updateOrCreate(
                ['email' => 'customer@inskylxstr.test'],
                [
                    'name' => 'Budi Santoso',
                    'password' => Hash::make('password'),
                    'role' => 'customer',
                    'phone' => '6289876543210',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}

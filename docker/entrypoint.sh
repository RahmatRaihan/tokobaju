#!/bin/sh
set -e

cd /app

# Ensure the storage symlink exists (public disk).
if [ ! -e public/storage ]; then
    php artisan storage:link || true
fi

# Cache config, routes and events so the worker boots with everything compiled.
php artisan config:cache
php artisan route:cache
php artisan event:cache

echo "INSKYLXSTR ready — Octane (FrankenPHP) on :8000"

# Run Laravel Octane on FrankenPHP: Laravel stays booted in memory between
# requests, so each request is served in ~10-50ms instead of a full bootstrap.
exec php artisan octane:frankenphp \
        --host=0.0.0.0 \
        --port=8000 \
        --workers=auto \
        --max-requests=500

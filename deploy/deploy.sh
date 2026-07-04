#!/usr/bin/env bash
# =====================================================================
# INSKYLXSTR — zero-fuss deploy/update script for the VPS.
# Run from the project root after `git pull`:  bash deploy/deploy.sh
# =====================================================================
set -euo pipefail

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing PHP dependencies (production, no dev)"
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> Installing & building frontend assets"
npm ci
npm run build

echo "==> Running database migrations"
php artisan migrate --force

echo "==> Linking storage (idempotent)"
php artisan storage:link || true

echo "==> Caching config, routes, events, views"
php artisan config:cache
php artisan route:cache
php artisan event:cache
php artisan view:cache

echo "==> Reloading Octane workers (graceful, zero downtime)"
php artisan octane:reload || sudo systemctl restart inskylxstr-octane

echo "==> Restarting queue worker"
sudo systemctl restart inskylxstr-queue || true

echo "==> Done. INSKYLXSTR is up to date."

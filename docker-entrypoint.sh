#!/bin/sh
set -e

echo "==> Running Laravel Migrations & Seeders..."
php artisan migrate --force
php artisan db:seed --force || true

echo "==> Caching Configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec "$@"

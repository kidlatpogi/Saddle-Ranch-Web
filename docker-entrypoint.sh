#!/bin/sh

echo "==> Ensuring Database & Storage Permissions..."
mkdir -p /var/www/html/storage/framework/views /var/www/html/storage/framework/sessions /var/www/html/storage/framework/cache /var/www/html/database
touch /var/www/html/database/database.sqlite
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

echo "==> Preparing Application..."
php artisan config:clear || true
php artisan cache:clear || true

echo "==> Running Database Migrations..."
php artisan migrate --force || true
php artisan db:seed --force || true

echo "==> Starting Application Server..."
exec "$@"

#!/usr/bin/env bash
# Render Build Script for Laravel + React Inertia (Saddle Ranch Web)
set -o errexit

echo "==> 1. Installing Composer Dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

echo "==> 2. Installing NPM Dependencies & Compiling Frontend Assets..."
npm ci || npm install
npm run build

echo "==> 3. Setting up Database & Storage..."
mkdir -p storage/framework/views storage/framework/sessions storage/framework/cache database
touch database/database.sqlite
chmod -R 775 storage bootstrap/cache database

echo "==> 4. Running Migrations & Caching Configuration..."
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "==> Render Build Completed Successfully!"

FROM php:8.2-cli-alpine

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    nodejs \
    npm \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    curl \
    oniguruma-dev \
    icu-dev \
    dos2unix

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_sqlite zip bcmath opcache mbstring intl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP & NPM dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm install --legacy-peer-deps
RUN npm run build

# Setup Storage & SQLite Permissions
RUN mkdir -p storage/framework/views storage/framework/sessions storage/framework/cache database
RUN touch database/database.sqlite
RUN chmod -R 777 storage bootstrap/cache database

# Entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN dos2unix /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

EXPOSE 10000

ENTRYPOINT ["docker-entrypoint"]
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]

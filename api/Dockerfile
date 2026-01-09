# Stage 1: Base PHP with Composer 
FROM php:8.3-fpm AS api

# Create app and log directories early
RUN mkdir -p /var/www/html/api \
    /var/log/supervisor \
    /var/run/supervisor


# System dependencies + Redis
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl dos2unix bash supervisor \
    redis-server redis-tools \
    libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libgmp-dev libpq-dev libicu-dev \
    libxslt-dev libssl-dev libcurl4-openssl-dev zlib1g-dev \
    libreadline-dev libedit-dev libsqlite3-dev libbz2-dev \
    libwebp-dev mariadb-client-compat \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install \
    bcmath sockets gmp pdo_mysql zip gd pcntl posix \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && docker-php-source delete \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
 && mkdir -p /tmp /var/log \
 && chmod -R 777 /tmp /var/log

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www/html/api

# Copy application
COPY . .

# Set Composer home to writable dir for non-root user
ENV COMPOSER_HOME=/var/www/html/api/.composer
RUN mkdir -p $COMPOSER_HOME && chmod -R 777 $COMPOSER_HOME

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache vendor /var/run /var/log \
 && chmod -R 775 storage bootstrap/cache vendor /var/run /var/log

# PHP & Supervisor configs
# -----------------------------
COPY php.ini /usr/local/etc/php/conf.d/custom.ini
COPY www.conf /usr/local/etc/php-fpm.d/www.conf
COPY supervisord.conf /etc/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh && chmod +x /entrypoint.sh

RUN mkdir -p /var/run/supervisor /var/log \
    && chown www-data:www-data /var/run/supervisor /var/log


# Use non-root user
USER www-data

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 9000

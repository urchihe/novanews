FROM php:8.3-fpm AS api

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl dos2unix bash supervisor redis-server redis-tools \
    libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libgmp-dev libpq-dev libicu-dev \
    libxslt-dev libssl-dev libcurl4-openssl-dev zlib1g-dev \
    libreadline-dev libedit-dev libsqlite3-dev libbz2-dev \
    libwebp-dev mariadb-client-compat \
 && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
 && docker-php-ext-install bcmath sockets gmp pdo_mysql zip gd pcntl posix \
 && pecl install redis \
 && docker-php-ext-enable redis \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/api
COPY . .

# Composer install as root
ENV COMPOSER_HOME=/var/www/html/api/.composer
RUN mkdir -p $COMPOSER_HOME && chmod -R 777 $COMPOSER_HOME \
 && composer install --no-interaction --prefer-dist --optimize-autoloader

# Permissions
RUN chown -R www-data:www-data storage bootstrap/cache /var/run /var/log /var/www/html/api/vendor \
 && chmod -R 775 storage bootstrap/cache /var/run /var/log /var/www/html/api/vendor

# Configs
COPY php.ini /usr/local/etc/php/conf.d/custom.ini
COPY www.conf /usr/local/etc/php-fpm.d/www.conf
COPY supervisord.conf /etc/supervisord.conf
COPY entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh && chmod +x /entrypoint.sh

USER www-data
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 9000

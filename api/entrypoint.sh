#!/bin/bash
set -e

mkdir -p /var/run/supervisor /var/log
chmod 0777 /var/run/supervisor /var/log

cd /var/www/html/api || exit

composer install --no-interaction --prefer-dist --optimize-autoloader

php artisan migrate --force || true
php artisan optimize:clear || true
php artisan optimize || true
php artisan news:fetch

php artisan horizon:terminate || true
php artisan queue:restart || true

exec /usr/bin/supervisord -c /etc/supervisord.conf

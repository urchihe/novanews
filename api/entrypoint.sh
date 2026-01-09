#!/bin/bash
set -e

cd /var/www/html/api || exit

php artisan migrate --force || true
php artisan optimize:clear || true
php artisan optimize || true
php artisan news:fetch

php artisan horizon:terminate || true
php artisan queue:restart || true

exec /usr/bin/supervisord -c /etc/supervisord.conf

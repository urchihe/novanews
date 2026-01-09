#!/bin/bash
set -e

cd /var/www/html/api || exit

# Wait for MySQL to be ready
echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
until mysqladmin ping -h"${DB_HOST}" -P"${DB_PORT}" --silent; do
  sleep 2
done
echo "MySQL is up!"

# Run Laravel tasks
php artisan migrate --force || true
php artisan optimize:clear || true
php artisan optimize || true
php artisan news:fetch

php artisan horizon:terminate || true
php artisan queue:restart || true

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf

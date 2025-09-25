#!/usr/bin/env bash
set -euo pipefail

: "${WAIT_FOR_DB_SECONDS:=60}"
: "${DB_CONNECTION:=pgsql}"
: "${APP_ENV:=local}"

echo "[start] DB_CONNECTION=$DB_CONNECTION"

use_sqlite=0
if [ "$DB_CONNECTION" = "pgsql" ]; then
  if command -v pg_isready >/dev/null 2>&1; then
    echo "[start] Waiting for Postgres up to ${WAIT_FOR_DB_SECONDS}s..."
    for i in $(seq 1 "$WAIT_FOR_DB_SECONDS"); do
      if pg_isready -h "${DB_HOST:-db}" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-postgres}" >/dev/null 2>&1; then
        echo "[start] Postgres is ready"
        break
      fi
      sleep 1
      if [ "$i" -eq "$WAIT_FOR_DB_SECONDS" ]; then
        echo "[start] Timeout — falling back to SQLite"
        use_sqlite=1
      fi
    done
  else
    echo "[start] pg_isready not found; falling back to SQLite"
    use_sqlite=1
  fi
fi

if [ "$use_sqlite" -eq 1 ]; then
  export DB_CONNECTION=sqlite
  export DB_DATABASE=/var/www/html/database/database.sqlite
  mkdir -p /var/www/html/database
  touch /var/www/html/database/database.sqlite
fi

php artisan key:generate --force
php artisan storage:link || true
php artisan migrate --force || true
php artisan db:seed --force || true

php -S 0.0.0.0:9000 -t public

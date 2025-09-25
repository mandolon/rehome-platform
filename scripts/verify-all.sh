#!/usr/bin/env bash
set -euo pipefail
NO_FRONTEND="${1:-}"
echo "=== DIY Verify: Backend ==="
pushd backend >/dev/null
[[ -f .env ]] || { cp .env.example .env || true; }
grep -q '^DB_CONNECTION=' .env || echo 'DB_CONNECTION=sqlite' >> .env
mkdir -p database && : > database/database.sqlite
[[ -d vendor ]] || composer install --no-interaction --prefer-dist
php artisan key:generate --force >/dev/null 2>&1 || true
php artisan migrate:fresh --seed -n
php artisan test
popd >/dev/null

if [[ "${NO_FRONTEND}" != "--no-frontend" ]]; then
  echo "=== DIY Verify: Frontend ==="
  pushd frontend >/dev/null
  ([[ -d node_modules ]] && npm run test -- --run) || { npm ci || npm install; npm run test -- --run; }
  popd >/dev/null
fi

echo "✅ DIY Verify complete."

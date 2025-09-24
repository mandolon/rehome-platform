# 🚀 Production Deployment Checklist

## Environment Configuration

### Backend (.env)
```env
# Production URLs
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://app.yourdomain.com

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=app.yourdomain.com,admin.yourdomain.com
SESSION_DOMAIN=.yourdomain.com  # Note the leading dot for subdomains
SESSION_DRIVER=redis  # Use Redis in production
SESSION_SECURE_COOKIE=true  # HTTPS only
SESSION_SAME_SITE=lax  # or 'none' if cross-domain

# Security
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-32-character-secret-key

# Database
DB_CONNECTION=mysql  # or postgresql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password

# Cache & Sessions
CACHE_DRIVER=redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_BASE=https://api.yourdomain.com
NEXT_PUBLIC_API_PREFIX=/api
NEXT_PUBLIC_API_WITH_CREDENTIALS=true
```

## CORS Configuration

### Lock Down Origins (config/cors.php)
```php
'allowed_origins' => [
    env('FRONTEND_URL'),  // https://app.yourdomain.com
    // Add other trusted origins, NO wildcards in production
],

'supports_credentials' => true,
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'allowed_headers' => ['*'],
```

## SSL/TLS Requirements

- [ ] **HTTPS Everywhere**: All URLs must use HTTPS in production
- [ ] **Valid SSL Certificate**: Ensure cert covers all domains/subdomains
- [ ] **HSTS Headers**: Consider adding HTTP Strict Transport Security
- [ ] **Secure Cookies**: `SESSION_SECURE_COOKIE=true` forces HTTPS-only cookies

## Cross-Domain Considerations

If frontend and backend are on different domains:
- [ ] Set `SESSION_SAME_SITE=none` (requires HTTPS)
- [ ] Ensure `SESSION_DOMAIN` matches your cookie domain strategy
- [ ] Test CORS preflight requests work correctly

## Security Hardening

### Laravel Security
- [ ] **Rate Limiting**: Add rate limits to auth endpoints
- [ ] **CSRF Protection**: Verify CSRF tokens are required for state-changing requests
- [ ] **Input Validation**: All endpoints have proper validation rules
- [ ] **SQL Injection**: Use Eloquent ORM, avoid raw queries
- [ ] **XSS Protection**: Sanitize user inputs, use `{{ }}` in Blade

### Frontend Security
- [ ] **Content Security Policy**: Add CSP headers
- [ ] **XSS Protection**: Sanitize user-generated content
- [ ] **Dependency Audit**: Run `npm audit` and fix vulnerabilities
- [ ] **Environment Variables**: Never expose secrets in client-side code

## Authentication Flow Testing

### Manual Testing Checklist
- [ ] **CSRF Bootstrap**: `GET /sanctum/csrf-cookie` returns 204 with cookies
- [ ] **Login**: `POST /api/auth/login` returns 200 with user data
- [ ] **Authenticated Requests**: `GET /api/auth/me` returns 200 with user
- [ ] **Session Persistence**: Refresh page, user stays logged in
- [ ] **Logout**: `POST /api/auth/logout` clears session
- [ ] **Unauthorized Access**: Unauthenticated requests return 401 JSON

### Automated Testing
- [ ] **API Tests**: Use `api-tests.http` file for comprehensive testing
- [ ] **E2E Tests**: Cypress tests for complete user flows
- [ ] **Unit Tests**: Backend auth controller tests
- [ ] **Integration Tests**: Frontend auth service tests

## Performance & Monitoring

### Caching
- [ ] **Redis**: Use Redis for sessions and cache in production
- [ ] **Config Caching**: Run `php artisan config:cache`
- [ ] **Route Caching**: Run `php artisan route:cache`
- [ ] **View Caching**: Run `php artisan view:cache`

### Monitoring
- [ ] **Health Checks**: `/api/health` endpoint responds correctly
- [ ] **Error Tracking**: Set up error monitoring (Sentry, Bugsnag)
- [ ] **Performance Monitoring**: Track API response times
- [ ] **Log Management**: Centralized logging for debugging

## Database & Migrations

- [ ] **Migration Status**: All migrations run successfully
- [ ] **Seeders**: Only run seeders appropriate for production
- [ ] **Backups**: Database backup strategy in place
- [ ] **Indexes**: Proper database indexes for performance

## Deployment Pipeline

### Pre-deployment
- [ ] **Code Review**: All changes reviewed and approved
- [ ] **Tests Pass**: All automated tests passing
- [ ] **Dependencies**: `composer install --no-dev --optimize-autoloader`
- [ ] **Assets**: Frontend build process completed

### Post-deployment
- [ ] **Smoke Tests**: Run critical path tests
- [ ] **Health Checks**: Verify all services are responding
- [ ] **Rollback Plan**: Know how to quickly rollback if issues arise

## User Experience

### Auth UX
- [ ] **Loading States**: Show loading indicators during auth requests
- [ ] **Error Handling**: Clear error messages for users
- [ ] **Auto-logout**: Handle session expiration gracefully
- [ ] **Remember Me**: Consider persistent login options

### Role-based Access
- [ ] **Frontend Guards**: Protect routes based on user roles
- [ ] **Backend Policies**: Laravel policies enforce permissions
- [ ] **UI Adaptation**: Show/hide features based on user role

## Development vs Production

### Development Only
```env
# Keep these ONLY in local development
APP_ENV=local
APP_DEBUG=true
SESSION_SECURE_COOKIE=false
TEST_ACCOUNT_PASSWORD=password  # For seeders
```

### Production Security
```env
# Production requirements
APP_ENV=production
APP_DEBUG=false
SESSION_SECURE_COOKIE=true
# Remove or randomize TEST_ACCOUNT_PASSWORD
```

## Quick Production Test Script

```bash
#!/bin/bash
# Test production auth flow
BASE_URL="https://api.yourdomain.com"
FRONTEND_URL="https://app.yourdomain.com"

echo "Testing CSRF..."
curl -i -c cookies.txt "$BASE_URL/sanctum/csrf-cookie"

echo "Testing login..."
XSRF_TOKEN=$(grep XSRF-TOKEN cookies.txt | cut -f7 | python3 -c "import urllib.parse; print(urllib.parse.unquote(input()))")
curl -i -H "X-XSRF-TOKEN: $XSRF_TOKEN" \
     -H "Content-Type: application/json" \
     -H "Origin: $FRONTEND_URL" \
     -b cookies.txt -c cookies.txt \
     -d '{"email":"admin@rehome.com","password":"your-prod-password"}' \
     "$BASE_URL/api/auth/login"

echo "Testing me endpoint..."
curl -i -H "Origin: $FRONTEND_URL" -b cookies.txt "$BASE_URL/api/auth/me"
```

---

## 🎯 Critical Success Metrics

- [ ] **CSRF**: 204 response with proper cookies set
- [ ] **Login**: 200 response with user JSON
- [ ] **Me**: 200 response with authenticated user data
- [ ] **Session Persistence**: User stays logged in across page refreshes
- [ ] **Security**: No CORS errors, proper HTTPS, secure cookies
- [ ] **Performance**: Auth requests complete within acceptable time limits

**✅ When all items are checked, your Sanctum SPA is production-ready!**

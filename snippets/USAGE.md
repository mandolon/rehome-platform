# Demo: How to use health-checks.http in VS Code

## Prerequisites:
1. Install "REST Client" extension in VS Code
2. Start your Laravel backend: `cd backend && php artisan serve --port=9000`
3. Open `snippets/health-checks.http` in VS Code

## Example Usage:

1. **Health Check** - Click "Send Request" above this line:
   ```
   GET http://127.0.0.1:9000/api/health
   ```
   Expected response: `{"status": "ok"}`

2. **CSRF Cookie** - Initialize session:
   ```
   GET http://127.0.0.1:9000/sanctum/csrf-cookie  
   ```
   Expected: 204 No Content with Set-Cookie headers

3. **Login** - After updating credentials:
   ```
   POST http://127.0.0.1:9000/login
   Content-Type: application/json
   
   {"email": "admin@example.com", "password": "password"}
   ```
   Expected: 200 with user data

4. **Authenticated Request**:
   ```
   GET http://127.0.0.1:9000/api/me
   ```
   Expected: 200 with current user info (after login)

## Environment Switching:

Create `.vscode/settings.json`:
```json
{
  "rest-client.environmentVariables": {
    "local": {"API_URL": "http://127.0.0.1:9000"},
    "staging": {"API_URL": "https://api-staging.example.com"}
  }
}
```

Then use Ctrl+Shift+P > "Rest Client: Switch Environment"

## npm Scripts:

- `npm run health:api` - Shows API URL and usage info
- `npm run csrf:init` - Shows CSRF flow documentation
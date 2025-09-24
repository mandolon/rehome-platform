describe('Sanctum Authentication Flow', () => {
  const baseUrl = Cypress.env('baseUrl') || 'http://localhost:3000'
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:9000'

  beforeEach(() => {
    // Clear cookies and local storage before each test
    cy.clearCookies()
    cy.clearLocalStorage()
    
    // Ensure backend is seeded with test user
    cy.request('POST', `${apiUrl}/api/test/seed-users`).then((response) => {
      expect(response.status).to.be.oneOf([200, 201, 409]) // 409 if already exists
    })
  })

  it('should complete full authentication flow', () => {
    // 1. Visit login page
    cy.visit('/login')
    cy.contains('Sign in to Rehome Platform').should('be.visible')

    // 2. Fill in login form
    cy.get('input[type="email"]').type('admin@rehome.com')
    cy.get('input[type="password"]').type('password')
    
    // 3. Submit login form
    cy.get('button[type="submit"]').click()
    
    // 4. Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.contains('Admin User').should('be.visible') // User name in header/nav

    // 5. Verify authentication persists on page refresh
    cy.reload()
    cy.url().should('include', '/dashboard')
    cy.contains('Admin User').should('be.visible')

    // 6. Test protected route access
    cy.visit('/projects')
    cy.url().should('include', '/projects') // Should not redirect to login
    
    // 7. Logout
    cy.get('[data-testid="user-menu"]').click() // Adjust selector as needed
    cy.get('[data-testid="logout-button"]').click()
    
    // 8. Should redirect to login and clear session
    cy.url().should('include', '/login')
    
    // 9. Verify session is cleared - try to access protected route
    cy.visit('/dashboard')
    cy.url().should('include', '/login') // Should redirect back to login
  })

  it('should handle login errors gracefully', () => {
    cy.visit('/login')
    
    // Test with invalid credentials
    cy.get('input[type="email"]').type('invalid@example.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    
    // Should show error message
    cy.contains('Invalid credentials').should('be.visible')
    cy.url().should('include', '/login') // Should stay on login page
  })

  it('should redirect unauthenticated users to login', () => {
    // Try to access protected route without authentication
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
    
    cy.visit('/projects')
    cy.url().should('include', '/login')
  })

  it('should handle CSRF token properly', () => {
    // Intercept API calls to verify CSRF token is sent
    cy.intercept('POST', `${apiUrl}/api/auth/login`).as('loginRequest')
    
    cy.visit('/login')
    cy.get('input[type="email"]').type('admin@rehome.com')
    cy.get('input[type="password"]').type('password')
    cy.get('button[type="submit"]').click()
    
    // Verify the login request included CSRF token
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.request.headers).to.have.property('x-xsrf-token')
      expect(interception.response?.statusCode).to.equal(200)
    })
  })

  it('should handle session expiration', () => {
    // Login first
    cy.visit('/login')
    cy.get('input[type="email"]').type('admin@rehome.com')
    cy.get('input[type="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')

    // Simulate session expiration by clearing server-side session
    cy.request('POST', `${apiUrl}/api/test/expire-session`)
    
    // Try to access a protected endpoint
    cy.visit('/projects')
    
    // Should redirect to login due to expired session
    cy.url().should('include', '/login')
  })

  it('should handle role-based access', () => {
    // Login as team member (non-admin)
    cy.visit('/login')
    cy.get('input[type="email"]').type('team1@rehome.com')
    cy.get('input[type="password"]').type('password')
    cy.get('button[type="submit"]').click()
    
    // Should access dashboard
    cy.url().should('include', '/dashboard')
    
    // Try to access admin-only route (adjust based on your routes)
    cy.visit('/admin/users')
    
    // Should either redirect or show access denied message
    cy.url().should('not.include', '/admin/users')
    // OR check for access denied message:
    // cy.contains('Access denied').should('be.visible')
  })
})

// Helper commands for authentication testing
Cypress.Commands.add('login', (email: string = 'admin@rehome.com', password: string = 'password') => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click()
  cy.get('[data-testid="logout-button"]').click()
  cy.url().should('include', '/login')
})

// Type definitions for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      logout(): Chainable<void>
    }
  }
}

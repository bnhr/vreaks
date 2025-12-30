/**
 * Example E2E Test with Playwright
 * 
 * This example demonstrates how to write end-to-end tests that validate complete user flows.
 * E2E tests run in real browsers and test the entire application from the user's perspective.
 * 
 * Key Features:
 * - Tests complete user flows across multiple pages
 * - Runs in real browsers (Chromium, Firefox, WebKit)
 * - Automatically starts development server
 * - Captures screenshots and videos on failure
 */

import { test, expect } from '@playwright/test'

/**
 * Example: Basic navigation test
 * 
 * This test demonstrates the basic pattern for E2E tests:
 * 1. Navigate to a page
 * 2. Interact with elements
 * 3. Verify the results
 */
test('navigates to about page', async ({ page }) => {
  // Navigate to home page
  await page.goto('/')

  // Verify home page loaded
  await expect(page).toHaveTitle(/Home/)

  // Click on About link
  await page.getByRole('link', { name: /about/i }).click()

  // Verify navigation to about page
  await expect(page).toHaveURL(/\/about/)
  await expect(page.getByRole('heading', { name: /about/i })).toBeVisible()
})

/**
 * Example: Form submission flow
 * 
 * This test demonstrates how to test form interactions:
 * - Fill in form fields
 * - Submit the form
 * - Verify the results
 */
test('submits contact form successfully', async ({ page }) => {
  // Navigate to contact page
  await page.goto('/contact')

  // Fill in form fields
  await page.getByLabel(/name/i).fill('John Doe')
  await page.getByLabel(/email/i).fill('john@example.com')
  await page.getByLabel(/message/i).fill('This is a test message')

  // Submit form
  await page.getByRole('button', { name: /submit/i }).click()

  // Verify success message
  await expect(page.getByText(/message sent successfully/i)).toBeVisible()
})

/**
 * Example: Authentication flow
 * 
 * This test demonstrates a complete authentication flow:
 * - Login with credentials
 * - Verify redirect to dashboard
 * - Verify authenticated state
 * - Logout
 */
test('completes login and logout flow', async ({ page }) => {
  // Navigate to login page
  await page.goto('/login')

  // Fill in login credentials
  await page.getByLabel(/email/i).fill('admin@example.com')
  await page.getByLabel(/password/i).fill('password123')

  // Submit login form
  await page.getByRole('button', { name: /log in/i }).click()

  // Verify redirect to dashboard
  await expect(page).toHaveURL(/\/admin\/dashboard/)

  // Verify user is logged in (check for user menu or logout button)
  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

  // Logout
  await page.getByRole('button', { name: /logout/i }).click()

  // Verify redirect to home or login page
  await expect(page).toHaveURL(/\/(login)?/)
})

/**
 * Example: Multi-step user flow
 * 
 * This test demonstrates testing a complex flow with multiple steps:
 * - Create a new item
 * - Edit the item
 * - Delete the item
 */
test('manages user lifecycle (create, edit, delete)', async ({ page }) => {
  // Login first (prerequisite for user management)
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('admin@example.com')
  await page.getByLabel(/password/i).fill('password123')
  await page.getByRole('button', { name: /log in/i }).click()

  // Navigate to users page
  await page.goto('/admin/users')

  // Create new user
  await page.getByRole('button', { name: /add user/i }).click()
  await page.getByLabel(/name/i).fill('Test User')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByRole('button', { name: /save/i }).click()

  // Verify user appears in list
  await expect(page.getByText('Test User')).toBeVisible()
  await expect(page.getByText('test@example.com')).toBeVisible()

  // Edit user
  await page.getByRole('button', { name: /edit.*test user/i }).click()
  await page.getByLabel(/name/i).clear()
  await page.getByLabel(/name/i).fill('Updated User')
  await page.getByRole('button', { name: /save/i }).click()

  // Verify user was updated
  await expect(page.getByText('Updated User')).toBeVisible()
  await expect(page.getByText('Test User')).not.toBeVisible()

  // Delete user
  await page.getByRole('button', { name: /delete.*updated user/i }).click()
  
  // Confirm deletion (if there's a confirmation dialog)
  await page.getByRole('button', { name: /confirm/i }).click()

  // Verify user was deleted
  await expect(page.getByText('Updated User')).not.toBeVisible()
})

/**
 * Example: Testing with API mocking
 * 
 * This test demonstrates how to mock API responses in E2E tests:
 * - Intercept network requests
 * - Return mock data
 * - Verify UI updates based on mock data
 */
test('displays mocked user data', async ({ page }) => {
  // Mock API response
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [
          { id: 1, name: 'Mocked User 1', email: 'mock1@example.com' },
          { id: 2, name: 'Mocked User 2', email: 'mock2@example.com' },
        ],
      }),
    })
  })

  // Navigate to users page
  await page.goto('/admin/users')

  // Verify mocked data is displayed
  await expect(page.getByText('Mocked User 1')).toBeVisible()
  await expect(page.getByText('Mocked User 2')).toBeVisible()
})

/**
 * Example: Testing error states
 * 
 * This test demonstrates how to test error handling:
 * - Trigger error conditions
 * - Verify error messages
 * - Verify error recovery
 */
test('handles network errors gracefully', async ({ page }) => {
  // Mock API to return error
  await page.route('**/api/users', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    })
  })

  // Navigate to users page
  await page.goto('/admin/users')

  // Verify error message is displayed
  await expect(page.getByText(/error loading users/i)).toBeVisible()

  // Verify retry button is available
  await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
})

/**
 * Example: Testing responsive behavior
 * 
 * This test demonstrates how to test responsive design:
 * - Set viewport size
 * - Verify mobile-specific elements
 * - Test mobile navigation
 */
test('displays mobile menu on small screens', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 })

  // Navigate to home page
  await page.goto('/')

  // Verify mobile menu button is visible
  await expect(page.getByRole('button', { name: /menu/i })).toBeVisible()

  // Open mobile menu
  await page.getByRole('button', { name: /menu/i }).click()

  // Verify navigation links are visible in mobile menu
  await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
})

/**
 * Example: Testing with screenshots
 * 
 * This test demonstrates how to capture screenshots for visual verification:
 * - Take full page screenshots
 * - Take element screenshots
 * - Compare screenshots (with additional tools)
 */
test('captures page screenshots', async ({ page }) => {
  await page.goto('/')

  // Take full page screenshot
  await page.screenshot({ path: 'screenshots/homepage.png', fullPage: true })

  // Take screenshot of specific element
  const header = page.getByRole('banner')
  await header.screenshot({ path: 'screenshots/header.png' })

  // Screenshots are automatically captured on test failure
  // This is configured in playwright.config.ts
})

/**
 * Best Practices for E2E Tests:
 * 
 * 1. Test complete user flows
 *    - Focus on critical user journeys
 *    - Test from the user's perspective
 *    - Avoid testing implementation details
 * 
 * 2. Use semantic selectors
 *    - Prefer getByRole, getByLabel, getByText
 *    - Avoid CSS selectors when possible
 *    - Ensures accessibility
 * 
 * 3. Wait for elements properly
 *    - Use expect().toBeVisible() for async waits
 *    - Playwright auto-waits for most actions
 *    - Avoid arbitrary timeouts
 * 
 * 4. Keep tests independent
 *    - Each test should work in isolation
 *    - Don't rely on test execution order
 *    - Clean up test data when needed
 * 
 * 5. Mock external dependencies
 *    - Mock third-party APIs
 *    - Control test data
 *    - Make tests reliable and fast
 * 
 * 6. Test error states
 *    - Verify error messages
 *    - Test error recovery
 *    - Ensure graceful degradation
 * 
 * 7. Use page object pattern for complex flows
 *    - Encapsulate page interactions
 *    - Improve test maintainability
 *    - Reduce duplication
 * 
 * 8. Run tests in CI/CD
 *    - Automate test execution
 *    - Capture artifacts on failure
 *    - Run on multiple browsers
 */

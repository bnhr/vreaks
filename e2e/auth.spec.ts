import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
	test('should complete login flow from start to finish', async ({ page }) => {
		// Navigate to login page
		await page.goto('/login')

		// Verify we're on the login page
		await expect(page.getByText('login today')).toBeVisible()

		// Click the login button
		await page.getByRole('button', { name: /login/i }).click()

		// Wait for navigation to admin page after successful login
		await page.waitForURL('/admin')

		// Verify we're on the admin dashboard
		await expect(page).toHaveURL('/admin')
		await expect(page.getByText('admin page')).toBeVisible()
		await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
	})

	test('should redirect to admin after successful login', async ({ page }) => {
		// Navigate to login page
		await page.goto('/login')

		// Perform login
		await page.getByRole('button', { name: /login/i }).click()

		// Verify redirect to admin page
		await page.waitForURL('/admin')
		await expect(page).toHaveURL('/admin')
	})

	test('should handle logout functionality', async ({ page }) => {
		// First, login
		await page.goto('/login')
		await page.getByRole('button', { name: /login/i }).click()
		await page.waitForURL('/admin')

		// Find and click logout button
		const logoutButton = page.getByRole('button', { name: /logout/i })
		await expect(logoutButton).toBeVisible()
		await logoutButton.click()

		// Wait for navigation after logout (there's a 1s delay in the code)
		await page.waitForURL('/', { timeout: 5000 })
		
		// Verify we're redirected to home page
		await expect(page).toHaveURL('/')
	})

	test('should redirect authenticated users from login page to admin', async ({ page }) => {
		// Login first
		await page.goto('/login')
		await page.getByRole('button', { name: /login/i }).click()
		await page.waitForURL('/admin')

		// Try to go back to login page
		await page.goto('/login')

		// Should automatically redirect to admin
		await page.waitForURL('/admin')
		await expect(page).toHaveURL('/admin')
	})
})

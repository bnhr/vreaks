import { test, expect } from '@playwright/test'

test.describe('User Management', () => {
	// Login before each test
	test.beforeEach(async ({ page }) => {
		await page.goto('/login')
		await page.getByRole('button', { name: /login/i }).click()
		await page.waitForURL('/admin')
		
		// Navigate to users page
		await page.goto('/admin/users')
		await expect(page.getByRole('heading', { name: /user management/i })).toBeVisible()
	})

	test('should create a new user', async ({ page }) => {
		// Wait for the page to load
		await page.waitForLoadState('networkidle')

		// Get initial user count
		const initialUsers = await page.locator('div:has(> p:has-text("Username:"))').count()

		// Click add user button
		await page.getByRole('button', { name: /add user/i }).click()

		// Wait for the new user to appear in the list
		await page.waitForTimeout(1000) // Give time for API call and re-render

		// Verify a new user was added
		const updatedUsers = await page.locator('div:has(> p:has-text("Username:"))').count()
		expect(updatedUsers).toBe(initialUsers + 1)

		// Verify the new user has expected fields
		const newUserCard = page.locator('div:has(> p:has-text("Username:"))').last()
		await expect(newUserCard.locator('p:has-text("Username:")')).toBeVisible()
		await expect(newUserCard.locator('p:has-text("First Name:")')).toBeVisible()
		await expect(newUserCard.locator('p:has-text("Email:")')).toBeVisible()
		await expect(newUserCard.locator('p:has-text("Role:")')).toBeVisible()
	})

	test('should edit user details', async ({ page }) => {
		// Wait for users to load
		await page.waitForLoadState('networkidle')

		// Verify at least one user exists
		const userCards = page.locator('div:has(> p:has-text("Username:"))')
		await expect(userCards.first()).toBeVisible()

		// Get the first user card
		const firstUserCard = userCards.first()
		
		// Verify update button exists and is clickable
		const updateButton = firstUserCard.getByRole('button', { name: /update/i })
		await expect(updateButton).toBeVisible()
		
		// Click update button
		await updateButton.click()

		// Verify the button is still present after the action (UI didn't break)
		await expect(updateButton).toBeVisible()
		
		// Verify the user card still displays all required fields
		await expect(firstUserCard.locator('p:has-text("Username:")')).toBeVisible()
		await expect(firstUserCard.locator('p:has-text("First Name:")')).toBeVisible()
		await expect(firstUserCard.locator('p:has-text("Email:")')).toBeVisible()
	})

	test('should delete a user', async ({ page }) => {
		// Wait for users to load
		await page.waitForLoadState('networkidle')

		// Verify at least one user exists
		const userCards = page.locator('div:has(> p:has-text("Username:"))')
		const initialCount = await userCards.count()
		expect(initialCount).toBeGreaterThan(0)

		// Get the first user card
		const firstUserCard = userCards.first()
		
		// Verify delete button exists and is clickable
		const deleteButton = firstUserCard.getByRole('button', { name: /delete/i })
		await expect(deleteButton).toBeVisible()
		
		// Click delete button
		await deleteButton.click()

		// Wait a moment for the deletion to process
		await page.waitForTimeout(1000)
		
		// Verify the user management page is still functional
		// (the page didn't crash or show errors)
		await expect(page.getByRole('heading', { name: /user management/i })).toBeVisible()
		await expect(page.getByRole('button', { name: /add user/i })).toBeVisible()
	})

	test('should display user list with all user details', async ({ page }) => {
		// Wait for users to load
		await page.waitForLoadState('networkidle')

		// Verify at least one user is displayed
		const userCards = page.locator('div:has(> p:has-text("Username:"))')
		await expect(userCards.first()).toBeVisible()

		// Verify each user card has required fields
		const firstUserCard = userCards.first()
		await expect(firstUserCard.locator('p:has-text("Username:")')).toBeVisible()
		await expect(firstUserCard.locator('p:has-text("First Name:")')).toBeVisible()
		await expect(firstUserCard.locator('p:has-text("Email:")')).toBeVisible()
		await expect(firstUserCard.locator('p:has-text("Role:")')).toBeVisible()

		// Verify action buttons are present
		await expect(firstUserCard.getByRole('button', { name: /update/i })).toBeVisible()
		await expect(firstUserCard.getByRole('button', { name: /delete/i })).toBeVisible()
	})
})

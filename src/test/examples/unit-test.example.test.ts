/**
 * Example Unit Test for Utilities
 *
 * This example demonstrates how to write unit tests for pure functions and utilities.
 * Unit tests run in Node.js (not browser) and are fast, focused tests for business logic.
 *
 * Key Features:
 * - Runs in Node.js environment (fast execution)
 * - Tests pure functions and utilities
 * - No DOM or React dependencies
 * - Focuses on business logic and data transformations
 */

import { describe, test, expect } from 'vitest'

/**
 * Example utility functions to test
 */
function formatCurrency(amount: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(amount)
}

function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

function calculateDiscount(price: number, discountPercent: number): number {
	if (discountPercent < 0 || discountPercent > 100) {
		throw new Error('Discount percent must be between 0 and 100')
	}
	return price * (1 - discountPercent / 100)
}

/**
 * Example: Testing pure functions
 *
 * Pure functions are the easiest to test:
 * - No side effects
 * - Same input always produces same output
 * - No external dependencies
 */
describe('formatCurrency', () => {
	test('formats USD currency correctly', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56')
	})

	test('formats EUR currency correctly', () => {
		expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
	})

	test('handles zero amount', () => {
		expect(formatCurrency(0)).toBe('$0.00')
	})

	test('handles negative amounts', () => {
		expect(formatCurrency(-50.25)).toBe('-$50.25')
	})
})

/**
 * Example: Testing validation functions
 *
 * Validation functions should test:
 * - Valid inputs return true
 * - Invalid inputs return false
 * - Edge cases (empty strings, special characters, etc.)
 */
describe('validateEmail', () => {
	test('accepts valid email addresses', () => {
		expect(validateEmail('user@example.com')).toBe(true)
		expect(validateEmail('test.user@domain.co.uk')).toBe(true)
		expect(validateEmail('name+tag@company.org')).toBe(true)
	})

	test('rejects invalid email addresses', () => {
		expect(validateEmail('invalid')).toBe(false)
		expect(validateEmail('missing@domain')).toBe(false)
		expect(validateEmail('@nodomain.com')).toBe(false)
		expect(validateEmail('spaces in@email.com')).toBe(false)
	})

	test('rejects empty string', () => {
		expect(validateEmail('')).toBe(false)
	})
})

/**
 * Example: Testing error conditions
 *
 * Always test that functions throw errors when they should:
 * - Use expect().toThrow() for error testing
 * - Test error messages when relevant
 * - Verify boundary conditions
 */
describe('calculateDiscount', () => {
	test('calculates discount correctly', () => {
		expect(calculateDiscount(100, 10)).toBe(90)
		expect(calculateDiscount(100, 50)).toBe(50)
		expect(calculateDiscount(100, 0)).toBe(100)
	})

	test('throws error for negative discount', () => {
		expect(() => calculateDiscount(100, -10)).toThrow(
			'Discount percent must be between 0 and 100',
		)
	})

	test('throws error for discount over 100', () => {
		expect(() => calculateDiscount(100, 150)).toThrow(
			'Discount percent must be between 0 and 100',
		)
	})

	test('handles boundary values', () => {
		expect(calculateDiscount(100, 100)).toBe(0)
		expect(calculateDiscount(100, 0)).toBe(100)
	})
})

/**
 * Example: Testing data transformations
 *
 * Test functions that transform data structures:
 * - Verify correct transformation
 * - Test with different input shapes
 * - Ensure immutability (original data unchanged)
 */
describe('data transformations', () => {
	interface User {
		id: number
		name: string
		email: string
	}

	function getUserNames(users: User[]): string[] {
		return users.map((user) => user.name)
	}

	function filterActiveUsers(users: (User & { active: boolean })[]): User[] {
		return users.filter((user) => user.active)
	}

	test('extracts user names from array', () => {
		const users: User[] = [
			{ id: 1, name: 'Alice', email: 'alice@example.com' },
			{ id: 2, name: 'Bob', email: 'bob@example.com' },
		]

		expect(getUserNames(users)).toEqual(['Alice', 'Bob'])
	})

	test('handles empty array', () => {
		expect(getUserNames([])).toEqual([])
	})

	test('filters active users', () => {
		const users = [
			{ id: 1, name: 'Alice', email: 'alice@example.com', active: true },
			{ id: 2, name: 'Bob', email: 'bob@example.com', active: false },
			{ id: 3, name: 'Charlie', email: 'charlie@example.com', active: true },
		]

		const activeUsers = filterActiveUsers(users)
		expect(activeUsers).toHaveLength(2)
		expect(activeUsers[0].name).toBe('Alice')
		expect(activeUsers[1].name).toBe('Charlie')
	})

	test('does not mutate original array', () => {
		const users = [
			{ id: 1, name: 'Alice', email: 'alice@example.com', active: true },
		]
		const original = [...users]

		filterActiveUsers(users)

		expect(users).toEqual(original)
	})
})

/**
 * Example: Testing async functions
 *
 * For async utilities (not API calls - use React Query for those):
 * - Use async/await in tests
 * - Test both success and error cases
 * - Verify timing when relevant
 */
describe('async utilities', () => {
	async function delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	async function retryOperation<T>(
		operation: () => Promise<T>,
		maxRetries = 3,
	): Promise<T> {
		let lastError: Error | undefined

		for (let i = 0; i < maxRetries; i++) {
			try {
				return await operation()
			} catch (error) {
				lastError = error as Error
				if (i < maxRetries - 1) {
					await delay(100)
				}
			}
		}

		throw lastError
	}

	test('delay waits for specified time', async () => {
		const start = Date.now()
		await delay(100)
		const elapsed = Date.now() - start

		expect(elapsed).toBeGreaterThanOrEqual(100)
		expect(elapsed).toBeLessThan(150) // Allow some margin
	})

	test('retryOperation succeeds on first try', async () => {
		const operation = async () => 'success'
		const result = await retryOperation(operation)

		expect(result).toBe('success')
	})

	test('retryOperation retries on failure', async () => {
		let attempts = 0
		const operation = async () => {
			attempts++
			if (attempts < 3) {
				throw new Error('Failed')
			}
			return 'success'
		}

		const result = await retryOperation(operation)

		expect(result).toBe('success')
		expect(attempts).toBe(3)
	})

	test('retryOperation throws after max retries', async () => {
		const operation = async () => {
			throw new Error('Always fails')
		}

		await expect(retryOperation(operation, 2)).rejects.toThrow('Always fails')
	})
})

/**
 * Best Practices for Unit Tests:
 *
 * 1. Test pure functions when possible
 *    - Easier to test
 *    - More reliable
 *    - Better code design
 *
 * 2. Use descriptive test names
 *    - Explain what is being tested
 *    - Include expected behavior
 *    - Make failures easy to understand
 *
 * 3. Test edge cases
 *    - Empty inputs
 *    - Boundary values
 *    - Invalid inputs
 *    - Error conditions
 *
 * 4. Keep tests focused
 *    - One assertion per test (when possible)
 *    - Test one behavior at a time
 *    - Avoid complex test setup
 *
 * 5. Avoid testing implementation details
 *    - Test the public API
 *    - Don't test private functions
 *    - Focus on behavior, not structure
 *
 * 6. Use factories for complex data
 *    - Consistent test data
 *    - Easy to maintain
 *    - Reduces duplication
 */

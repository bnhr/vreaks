import '@testing-library/jest-dom'

/**
 * Global test configuration and setup
 * This file is automatically loaded before tests run
 */

/**
 * Setup test environment with necessary configurations
 */
export function setupTestEnvironment(): void {
	// Set up global error handlers for unhandled rejections
	if (typeof process !== 'undefined') {
		process.on('unhandledRejection', (reason) => {
			console.error('Unhandled Rejection in test:', reason)
		})
	}

	// Configure console to suppress noise in tests (optional)
	const originalError = console.error
	console.error = (...args: unknown[]) => {
		// Filter out known React warnings that are expected in tests
		const message = args[0]
		if (
			typeof message === 'string' &&
			(message.includes('Not implemented: HTMLFormElement.prototype.submit') ||
				message.includes('Not implemented: navigation'))
		) {
			return
		}
		originalError.apply(console, args)
	}
}

// Auto-run setup
setupTestEnvironment()

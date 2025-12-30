/**
 * Example Component Test with Vitest Browser Mode
 *
 * This example demonstrates how to write component tests that run in real browsers.
 * Component tests validate React component behavior in isolation using real browser APIs.
 *
 * Key Features:
 * - Runs in real Chromium browser (not JSDOM)
 * - Uses real browser APIs (no polyfills)
 * - Tests user interactions with native events
 * - Validates component rendering and behavior
 */

import { describe, test, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { renderWithProviders } from '~/test'
import { userFactory } from '~/test/factories'

/**
 * Example: Simple component test
 *
 * This test demonstrates the basic pattern for testing a component:
 * 1. Render the component with renderWithProviders
 * 2. Query for elements using Testing Library queries
 * 3. Assert on the rendered output
 */
test('renders user information correctly', () => {
	// Arrange: Create test data using factories
	const user = userFactory.build({
		name: 'Jane Doe',
		email: 'jane@example.com',
	})

	// Act: Render the component
	renderWithProviders(
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
		</div>,
	)

	// Assert: Verify the output
	expect(screen.getByText('Jane Doe')).toBeInTheDocument()
	expect(screen.getByText('jane@example.com')).toBeInTheDocument()
})

/**
 * Example: Testing user interactions
 *
 * This test demonstrates how to simulate user interactions:
 * - Use userEvent.setup() to create a user instance
 * - Use async/await for user interactions
 * - Verify the results of interactions
 */
test('handles button click interactions', async () => {
	// Arrange: Set up user event and mock handler
	const user = userEvent.setup()
	let clickCount = 0
	const handleClick = () => {
		clickCount++
	}

	// Act: Render component with click handler
	renderWithProviders(<button onClick={handleClick}>Click me</button>)

	// Act: Simulate user clicking the button
	await user.click(screen.getByRole('button', { name: /click me/i }))

	// Assert: Verify the handler was called
	expect(clickCount).toBe(1)
})

/**
 * Example: Testing with React Query
 *
 * This test demonstrates how to test components that use React Query:
 * - renderWithProviders automatically provides QueryClientProvider
 * - Access queryClient from the render result
 * - Use waitFor for async state updates
 */
test('displays data from React Query', async () => {
	// Arrange: Create test data
	const user = userFactory.build({ name: 'John Smith' })

	// Act: Render component (renderWithProviders provides QueryClient)
	const { queryClient } = renderWithProviders(
		<div>
			<p>Loading user data...</p>
		</div>,
	)

	// Simulate setting query data
	queryClient.setQueryData(['user'], user)

	// Assert: Verify query data is accessible
	const cachedUser = queryClient.getQueryData(['user'])
	expect(cachedUser).toEqual(user)
})

/**
 * Example: Testing conditional rendering
 *
 * This test demonstrates how to test components with conditional logic:
 * - Test different states (loading, error, success)
 * - Use queryByText for elements that may not exist
 * - Verify correct rendering based on props
 */
describe('conditional rendering', () => {
	test('shows loading state', () => {
		const isLoading = true
		const isLoaded = false

		renderWithProviders(
			<div>
				{isLoading && <p>Loading...</p>}
				{isLoaded && <p>Content loaded</p>}
			</div>,
		)

		expect(screen.getByText('Loading...')).toBeInTheDocument()
		expect(screen.queryByText('Content loaded')).not.toBeInTheDocument()
	})

	test('shows content when loaded', () => {
		const isLoading = false
		const isLoaded = true

		renderWithProviders(
			<div>
				{isLoading && <p>Loading...</p>}
				{isLoaded && <p>Content loaded</p>}
			</div>,
		)

		expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
		expect(screen.getByText('Content loaded')).toBeInTheDocument()
	})
})

/**
 * Example: Testing forms
 *
 * This test demonstrates how to test form interactions:
 * - Fill in form fields with userEvent.type()
 * - Submit forms with userEvent.click()
 * - Verify form submission results
 */
test('handles form submission', async () => {
	// Arrange: Set up user event and submission handler
	const user = userEvent.setup()
	let submittedData: { name: string; email: string } | null = null

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		submittedData = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
		}
	}

	// Act: Render form
	renderWithProviders(
		<form onSubmit={handleSubmit}>
			<input
				name="name"
				placeholder="Name"
			/>
			<input
				name="email"
				placeholder="Email"
				type="email"
			/>
			<button type="submit">Submit</button>
		</form>,
	)

	// Act: Fill in and submit form
	await user.type(screen.getByPlaceholderText('Name'), 'Alice')
	await user.type(screen.getByPlaceholderText('Email'), 'alice@example.com')
	await user.click(screen.getByRole('button', { name: /submit/i }))

	// Assert: Verify form data was submitted
	expect(submittedData).toEqual({
		name: 'Alice',
		email: 'alice@example.com',
	})
})

/**
 * Best Practices for Component Tests:
 *
 * 1. Use renderWithProviders for all component tests
 *    - Automatically provides QueryClient, Router, and other providers
 *    - Ensures consistent test environment
 *
 * 2. Use factories for test data
 *    - Consistent, valid test data
 *    - Easy to override specific fields
 *    - Reduces test boilerplate
 *
 * 3. Query by role and accessible names
 *    - screen.getByRole('button', { name: /submit/i })
 *    - Ensures accessibility
 *    - More resilient to implementation changes
 *
 * 4. Use userEvent for interactions
 *    - More realistic than fireEvent
 *    - Properly simulates user behavior
 *    - Always use async/await
 *
 * 5. Test user behavior, not implementation
 *    - Focus on what users see and do
 *    - Avoid testing internal state
 *    - Test the component's public API
 */

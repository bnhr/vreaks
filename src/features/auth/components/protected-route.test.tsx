import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test'
import { ProtectedRoute } from './protected-route'

// Mock the useAuth hook
vi.mock('../hooks/use-auth', () => ({
	useAuth: vi.fn(),
}))

import { useAuth } from '../hooks/use-auth'

describe('ProtectedRoute', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders children when user is authenticated', () => {
		vi.mocked(useAuth).mockReturnValue({
			isAuthenticated: true,
			isLoading: false,
			isError: false,
			user: {
				id: '1',
				email: 'test@example.com',
				username: 'testuser',
				first_name: 'Test',
				last_name: 'User',
				role: 'user',
				status: 'active',
				email_verified: true,
			},
		})

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>,
			{
				routes: [{ path: '/login', element: <div>Login Page</div> }],
			},
		)

		expect(screen.getByText('Protected Content')).toBeInTheDocument()
	})

	it('shows loading state when authentication is loading', () => {
		vi.mocked(useAuth).mockReturnValue({
			isAuthenticated: false,
			isLoading: true,
			isError: false,
			user: undefined,
		})

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>,
			{
				routes: [{ path: '/login', element: <div>Login Page</div> }],
			},
		)

		expect(screen.getByText('Loading...')).toBeInTheDocument()
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
	})

	it('does not render children when user is not authenticated', () => {
		vi.mocked(useAuth).mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			isError: false,
			user: undefined,
		})

		renderWithProviders(
			<ProtectedRoute>
				<div>Protected Content</div>
			</ProtectedRoute>,
			{
				routes: [{ path: '/login', element: <div>Login Page</div> }],
			},
		)

		// Should not render protected content when not authenticated
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
	})
})

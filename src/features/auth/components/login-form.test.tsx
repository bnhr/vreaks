import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test'
import LoginForm from './login-form'

// Mock the useLogin hook
vi.mock('../api/use-login', () => ({
	useLogin: vi.fn(),
}))

// Mock the useAuth hook
vi.mock('../hooks/use-auth', () => ({
	useAuth: vi.fn(),
}))

import { useLogin } from '../api/use-login'
import { useAuth } from '../hooks/use-auth'

describe('LoginForm', () => {
	const mockMutate = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		// Mock useAuth to return not authenticated by default
		vi.mocked(useAuth).mockReturnValue({
			isAuthenticated: false,
			isLoading: false,
			isError: false,
			user: undefined,
		})
		// Mock useLogin to return success state
		vi.mocked(useLogin).mockReturnValue({
			mutate: mockMutate,
			isError: false,
			error: null,
			isPending: false,
			isSuccess: false,
			isIdle: true,
			isPaused: false,
			data: undefined,
			reset: vi.fn(),
			mutateAsync: vi.fn(),
			variables: undefined,
			context: undefined,
			failureCount: 0,
			failureReason: null,
			status: 'idle',
			submittedAt: 0,
		})
	})

	it('renders login form with button', () => {
		renderWithProviders(<LoginForm />, {
			routes: [{ path: '/admin', element: <div>Admin Page</div> }],
		})
		expect(screen.getByText('login today')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
	})

	it('calls mutate when login button is clicked', async () => {
		const user = userEvent.setup()
		renderWithProviders(<LoginForm />, {
			routes: [{ path: '/admin', element: <div>Admin Page</div> }],
		})

		const loginButton = screen.getByRole('button', { name: /login/i })
		await user.click(loginButton)

		expect(mockMutate).toHaveBeenCalledWith(
			{ email: 'admin@example.com', password: 'Admin123!' },
			expect.objectContaining({
				onSuccess: expect.any(Function),
			}),
		)
	})

	it('displays error message when login fails', () => {
		vi.mocked(useLogin).mockReturnValue({
			mutate: mockMutate,
			isError: true,
			error: new Error('Invalid credentials'),
			isPending: false,
			isSuccess: false,
			isIdle: false,
			isPaused: false,
			data: undefined,
			reset: vi.fn(),
			mutateAsync: vi.fn(),
			variables: { email: 'admin@example.com', password: 'Admin123!' },
			context: undefined,
			failureCount: 1,
			failureReason: null,
			status: 'error',
			submittedAt: 0,
		})

		renderWithProviders(<LoginForm />, {
			routes: [{ path: '/admin', element: <div>Admin Page</div> }],
		})
		expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
	})
})

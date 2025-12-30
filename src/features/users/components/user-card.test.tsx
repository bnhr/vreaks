import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../test'
import { UserCard } from './user-card'
import type { User } from '../types/user.types'

// Mock the API hooks
vi.mock('../api/use-delete-user', () => ({
	useDeleteUser: vi.fn(),
}))

vi.mock('../api/use-update-user', () => ({
	useUpdateUser: vi.fn(),
}))

import { useDeleteUser } from '../api/use-delete-user'
import { useUpdateUser } from '../api/use-update-user'

describe('UserCard', () => {
	const mockDeleteMutate = vi.fn()
	const mockUpdateMutate = vi.fn()

	const mockUser: User = {
		id: '1',
		email: 'test@example.com',
		username: 'testuser',
		first_name: 'Test',
		last_name: 'User',
		role: 'user',
		status: 'active',
		email_verified: true,
	}

	beforeEach(() => {
		vi.clearAllMocks()

		vi.mocked(useDeleteUser).mockReturnValue({
			mutate: mockDeleteMutate,
			isPending: false,
			isError: false,
			error: null,
			isSuccess: false,
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

		vi.mocked(useUpdateUser).mockReturnValue({
			mutate: mockUpdateMutate,
			isPending: false,
			isError: false,
			error: null,
			isSuccess: false,
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

	it('renders user information correctly', () => {
		renderWithProviders(<UserCard user={mockUser} />)

		expect(screen.getByText('testuser')).toBeInTheDocument()
		expect(screen.getByText('Test')).toBeInTheDocument()
		expect(screen.getByText('test@example.com')).toBeInTheDocument()
		expect(screen.getByText('user')).toBeInTheDocument()
	})

	it('calls delete mutation when delete button is clicked', async () => {
		const user = userEvent.setup()
		renderWithProviders(<UserCard user={mockUser} />)

		const deleteButton = screen.getByRole('button', { name: /delete/i })
		await user.click(deleteButton)

		expect(mockDeleteMutate).toHaveBeenCalledWith(
			'1',
			expect.objectContaining({
				onSuccess: expect.any(Function),
			}),
		)
	})

	it('calls update mutation when update button is clicked', async () => {
		const user = userEvent.setup()
		renderWithProviders(<UserCard user={mockUser} />)

		const updateButton = screen.getByRole('button', { name: /update/i })
		await user.click(updateButton)

		expect(mockUpdateMutate).toHaveBeenCalledWith(
			{
				id: '1',
				payload: { first_name: 'Test_edited' },
			},
			expect.objectContaining({
				onSuccess: expect.any(Function),
			}),
		)
	})
})

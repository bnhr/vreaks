import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test'
import { UserList } from './user-list'
import type { User } from '../types/user.types'

// Mock the API hooks
vi.mock('../api/use-users-query', () => ({
	useUsersQuery: vi.fn(),
}))

// Mock the UserCard component to simplify testing
vi.mock('./user-card', () => ({
	UserCard: ({ user }: { user: User }) => (
		<div data-testid={`user-card-${user.id}`}>{user.username}</div>
	),
}))

import { useUsersQuery } from '../api/use-users-query'

describe('UserList', () => {
	const mockUsers: User[] = [
		{
			id: '1',
			email: 'user1@example.com',
			username: 'user1',
			first_name: 'User',
			last_name: 'One',
			role: 'user',
			status: 'active',
			email_verified: true,
		},
		{
			id: '2',
			email: 'user2@example.com',
			username: 'user2',
			first_name: 'User',
			last_name: 'Two',
			role: 'admin',
			status: 'active',
			email_verified: true,
		},
	]

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('shows loading state when data is loading', () => {
		vi.mocked(useUsersQuery).mockReturnValue({
			data: undefined,
			error: null,
			isLoading: true,
			isError: false,
			isSuccess: false,
			status: 'pending',
			dataUpdatedAt: 0,
			errorUpdatedAt: 0,
			failureCount: 0,
			failureReason: null,
			errorUpdateCount: 0,
			isFetched: false,
			isFetchedAfterMount: false,
			isFetching: false,
			isLoadingError: false,
			isPaused: false,
			isPending: true,
			isPlaceholderData: false,
			isRefetchError: false,
			isRefetching: false,
			isStale: false,
			refetch: vi.fn(),
			fetchStatus: 'fetching',
		})

		renderWithProviders(<UserList />)
		expect(screen.getByText('loading...')).toBeInTheDocument()
	})

	it('shows error state when there is an error', () => {
		vi.mocked(useUsersQuery).mockReturnValue({
			data: undefined,
			error: new Error('Failed to fetch users'),
			isLoading: false,
			isError: true,
			isSuccess: false,
			status: 'error',
			dataUpdatedAt: 0,
			errorUpdatedAt: Date.now(),
			failureCount: 1,
			failureReason: new Error('Failed to fetch users'),
			errorUpdateCount: 1,
			isFetched: true,
			isFetchedAfterMount: true,
			isFetching: false,
			isLoadingError: true,
			isPaused: false,
			isPending: false,
			isPlaceholderData: false,
			isRefetchError: false,
			isRefetching: false,
			isStale: false,
			refetch: vi.fn(),
			fetchStatus: 'idle',
		})

		renderWithProviders(<UserList />)
		expect(screen.getByText('error.')).toBeInTheDocument()
	})

	it('renders list of users when data is loaded', () => {
		vi.mocked(useUsersQuery).mockReturnValue({
			data: {
				status: 'success',
				data: {
					data: mockUsers,
					pagination: {
						page: 1,
						per_page: 10,
						total: 2,
						total_pages: 1,
					},
				},
			},
			error: null,
			isLoading: false,
			isError: false,
			isSuccess: true,
			status: 'success',
			dataUpdatedAt: Date.now(),
			errorUpdatedAt: 0,
			failureCount: 0,
			failureReason: null,
			errorUpdateCount: 0,
			isFetched: true,
			isFetchedAfterMount: true,
			isFetching: false,
			isLoadingError: false,
			isPaused: false,
			isPending: false,
			isPlaceholderData: false,
			isRefetchError: false,
			isRefetching: false,
			isStale: false,
			refetch: vi.fn(),
			fetchStatus: 'idle',
		})

		renderWithProviders(<UserList />)

		expect(screen.getByTestId('user-card-1')).toBeInTheDocument()
		expect(screen.getByTestId('user-card-2')).toBeInTheDocument()
		expect(screen.getByText('user1')).toBeInTheDocument()
		expect(screen.getByText('user2')).toBeInTheDocument()
	})
})

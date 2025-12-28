import { useMeQuery } from '../api/use-me-query'

/**
 * Hook to derive auth state from React Query
 * This replaces the need for Zustand auth state by deriving it from the server
 */
export function useAuth() {
	const { data: currentUser, isLoading, isError } = useMeQuery()

	return {
		user: currentUser?.data,
		isAuthenticated: !!currentUser?.data,
		isLoading,
		isError,
	}
}

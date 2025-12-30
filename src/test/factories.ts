/**
 * Test data factories for generating consistent test data
 * Uses the factory pattern to create test objects with sensible defaults
 */

/**
 * Generic factory interface for creating test data
 */
export interface TestDataFactory<T> {
	/**
	 * Build a single instance with optional overrides
	 */
	build(overrides?: Partial<T>): T

	/**
	 * Build a list of instances with optional overrides
	 */
	buildList(count: number, overrides?: Partial<T>): T[]
}

/**
 * User factory for creating test users
 */
export interface TestUser {
	id: string
	name: string
	email: string
	role: 'user' | 'admin'
	authenticated: boolean
	premium: boolean
}

let userSequence = 1

export const userFactory: TestDataFactory<TestUser> = {
	build(overrides?: Partial<TestUser>): TestUser {
		const id = userSequence++
		return {
			id: `user-${id}`,
			name: `Test User ${id}`,
			email: `user${id}@example.com`,
			role: 'user',
			authenticated: true,
			premium: false,
			...overrides,
		}
	},

	buildList(count: number, overrides?: Partial<TestUser>): TestUser[] {
		return Array.from({ length: count }, () => this.build(overrides))
	},
}

/**
 * Auth state factory for creating test authentication states
 */
export interface TestAuthState {
	user: TestUser | null
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
}

export const authFactory: TestDataFactory<TestAuthState> = {
	build(overrides?: Partial<TestAuthState>): TestAuthState {
		const user =
			overrides?.user !== undefined ? overrides.user : userFactory.build()
		const isAuthenticated = overrides?.isAuthenticated ?? user !== null

		return {
			user,
			token: isAuthenticated
				? 'test-token-' + Math.random().toString(36).substring(7)
				: null,
			isAuthenticated,
			isLoading: false,
			...overrides,
		}
	},

	buildList(
		count: number,
		overrides?: Partial<TestAuthState>,
	): TestAuthState[] {
		return Array.from({ length: count }, () => this.build(overrides))
	},
}

/**
 * API response factory for creating test API responses
 */
export interface TestApiResponse<T> {
	data: T
	status: number
	headers: Record<string, string>
	error?: string
}

export function createApiResponseFactory<T>(
	defaultData: T,
): TestDataFactory<TestApiResponse<T>> {
	return {
		build(overrides?: Partial<TestApiResponse<T>>): TestApiResponse<T> {
			return {
				data: defaultData,
				status: 200,
				headers: {
					'content-type': 'application/json',
				},
				...overrides,
			}
		},

		buildList(
			count: number,
			overrides?: Partial<TestApiResponse<T>>,
		): TestApiResponse<T>[] {
			return Array.from({ length: count }, () => this.build(overrides))
		},
	}
}

/**
 * Reset all factory sequences (useful between tests)
 */
export function resetFactories(): void {
	userSequence = 1
}

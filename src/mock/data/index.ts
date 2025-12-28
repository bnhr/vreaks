import { User } from '~/features/users'
import { MOCK_API_CONFIG } from '~/shared/api/config'

interface MockData {
	users: User[]
	currentUser: User | null
	accessToken: string | null
	refreshToken: string | null
}

const INITIAL_USERS: User[] = [
	{
		id: '123e4567-e89b-12d3-a456-426614174000',
		email: 'admin@example.com',
		username: 'admin',
		first_name: 'Admin',
		last_name: 'User',
		role: 'admin',
		status: 'active',
		email_verified: false,
	},
	{
		id: '456e7890-e89b-12d3-a456-426614174001',
		email: 'user@example.com',
		username: 'user',
		first_name: 'Regular',
		last_name: 'User',
		role: 'user',
		status: 'active',
		email_verified: false,
	},
	{
		id: '789e0123-e89b-12d3-a456-426614174002',
		email: 'user2@example.com',
		username: 'user2',
		first_name: 'Another',
		last_name: 'User',
		role: 'user',
		status: 'active',
		email_verified: false,
	},
]

export const getInitialMockData = (): MockData => ({
	users: INITIAL_USERS,
	currentUser: null,
	accessToken: null,
	refreshToken: null,
})

export function loadMockData(): MockData {
	try {
		const stored = localStorage.getItem(MOCK_API_CONFIG.STORAGE_KEY)
		if (stored) {
			return JSON.parse(stored) as MockData
		}
	} catch (error) {
		console.error('Failed to load mock data:', error)
	}
	return getInitialMockData()
}

export function saveMockData(data: MockData): void {
	try {
		localStorage.setItem(MOCK_API_CONFIG.STORAGE_KEY, JSON.stringify(data))
	} catch (error) {
		console.error('Failed to save mock data:', error)
	}
}

export function resetMockData(): void {
	localStorage.removeItem(MOCK_API_CONFIG.STORAGE_KEY)
}

export function generateId(): string {
	return crypto.randomUUID()
}

export function generateTokens() {
	return {
		access_token: `mock_access_${Date.now()}_${Math.random().toString(36).substring(7)}`,
		refresh_token: `mock_refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`,
		expires_in: 3600,
	}
}

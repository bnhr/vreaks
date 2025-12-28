import { MOCK_API_CONFIG } from '~/shared/api/config'

/**
 * Get data from localStorage with the mock API storage key
 */
export function getMockStorage<T>(key?: string): T | null {
	try {
		const storageKey = key || MOCK_API_CONFIG.STORAGE_KEY
		const stored = localStorage.getItem(storageKey)
		if (stored) {
			return JSON.parse(stored) as T
		}
	} catch (error) {
		console.error('Failed to get mock storage:', error)
	}
	return null
}

/**
 * Set data in localStorage with the mock API storage key
 */
export function setMockStorage<T>(data: T, key?: string): void {
	try {
		const storageKey = key || MOCK_API_CONFIG.STORAGE_KEY
		localStorage.setItem(storageKey, JSON.stringify(data))
	} catch (error) {
		console.error('Failed to set mock storage:', error)
	}
}

/**
 * Clear data from localStorage with the mock API storage key
 */
export function clearMockStorage(key?: string): void {
	try {
		const storageKey = key || MOCK_API_CONFIG.STORAGE_KEY
		localStorage.removeItem(storageKey)
	} catch (error) {
		console.error('Failed to clear mock storage:', error)
	}
}

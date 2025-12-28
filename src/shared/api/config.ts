export const MOCK_API_CONFIG = {
	ENABLE_DELAYS: true,
	DELAY_MS: 300,
	STORAGE_KEY: 'mock_api_data',
} as const

export const QUERY_CONFIG = {
	STALE_TIME: 5 * 60 * 1000,
	CACHE_TIME: 10 * 60 * 1000,
	RETRY: 2,
	RETRY_DELAY: 1000,
} as const

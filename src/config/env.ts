export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

export const API_BASE_URL =
	import.meta.env.VITE_BE_URL || 'http://localhost:8000'

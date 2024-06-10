export interface LoginData {
	code: number
	status: 'success' | 'error'
	data: Tokens
}

interface Tokens {
	access_token: string
	refresh_token: string
}

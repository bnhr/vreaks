export interface LoginData {
	code: number
	status: 'success' | 'error'
	data: Tokens
}

export interface SuccessResponse {
	code: number
	status: 'success'
}

interface Tokens {
	access_token: string
	refresh_token: string
}

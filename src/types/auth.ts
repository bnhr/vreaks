export interface LoginData {
	statusCode: number
	message: string
	data: Tokens
}

interface Tokens {
	accessToken: string
	refreshToken: string
}

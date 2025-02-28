/**
 * Ky API Client Configuration
 *
 * This file configures the Ky HTTP client with authentication handling,
 * request/response hooks, and automatic token refresh functionality.
 * It serves as the central API client for the application.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Cookies from 'js-cookie'
import ky from 'ky'
import { authApi } from './list'
import { LoginData } from '~/types/auth'

/**
 * Configured Ky instance for making authenticated API requests
 *
 * Features:
 * - Automatic token attachment to requests
 * - JSON content type headers
 * - Request timeout handling
 * - Retry logic with token refresh
 * - Response error logging
 */
export const kyAPI = ky.create({
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	timeout: 30000, // 30 second timeout
	retry: {
		limit: 2,
		methods: ['get', 'post', 'put', 'patch', 'delete'],
		statusCodes: [401, 500, 502, 503, 504], // Retry on auth error and server errors
	},
	hooks: {
		/**
		 * Runs before each request to attach authorization token if available
		 */
		beforeRequest: [
			async (request) => {
				console.log('🚀 ~ request:', request)
				const token = Cookies.get('token')
				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			},
		],
		/**
		 * Executes before retry attempts to refresh token if needed
		 * Will redirect to home page if authentication completely fails
		 */
		beforeRetry: [
			async ({ request, options, error, retryCount }) => {
				const token = Cookies.get('token')
				const refresh = Cookies.get('refresh')

				if (refresh && retryCount < 2) {
					refreshAccessToken()
				}

				if (retryCount >= 2) {
					if (!token && !refresh) {
						window.location.replace('/')
					}
				}
			},
		],
		/**
		 * Logs response errors for debugging purposes
		 */
		afterResponse: [
			async (request, _options, response) => {
				if (!response.ok) {
					console.error('Request failed', {
						url: request.url,
						status: response.status,
						method: request.method,
					})
				}
			},
		],
	},
})

/**
 * Refreshes the access token using the refresh token
 *
 * This function attempts to get a new access token using the stored refresh token.
 * If successful, it updates both tokens in cookies. If it fails, it redirects
 * the user to the home/login page.
 *
 * @returns {Promise<string|null>} The new access token if refresh succeeded, null otherwise
 */
async function refreshAccessToken(): Promise<string | null> {
	try {
		const refresh = Cookies.get('refresh')
		if (!refresh) throw new Error('No refresh token')

		const res = await ky
			.post(authApi.refresh, {
				headers: { Authorization: `Bearer ${refresh}` },
			})
			.json<LoginData>()

		if (res.status === 'success') {
			// Store the new tokens in cookies
			Cookies.set('token', res.data.access_token, {
				expires: 1,
				path: '/',
				secure: true,
			})
			Cookies.set('refresh', res.data.refresh_token, {
				expires: 1,
				path: '/',
				secure: true,
			})
			return res.data.access_token
		}
	} catch (error) {
		console.error('Token refresh failed', error)
		window.location.replace('/')
		return null
	}
	return null
}

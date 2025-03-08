/**
 * Ky API Client Configuration
 *
 * This file configures the Ky HTTP client with authentication handling,
 * request/response hooks, and automatic token refresh functionality.
 * It serves as the central API client for the application.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ky from 'ky'
import { authApi } from './list'
import { SuccessResponse } from '~/types/auth'

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
	credentials: 'include',
	timeout: 30000, // 30 second timeout
	retry: {
		limit: 2,
		methods: ['get', 'post', 'put', 'patch', 'delete'],
		statusCodes: [401, 500, 502, 503, 504], // Retry on auth error and server errors
	},
	hooks: {
		/**
		 * Executes before retry attempts to refresh token if needed
		 * Will redirect to home page if authentication completely fails
		 */
		beforeRetry: [
			async ({ request, options, error, retryCount }) => {
				if (retryCount < 2) {
					const tokenRefreshed = await refreshAccessToken()
					if (!tokenRefreshed) {
						window.location.replace('/')
					}
				} else {
					window.location.replace('/')
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
 * @returns {Promise<boolean>} True if refresh succeeded, false otherwise
 */
async function refreshAccessToken(): Promise<boolean> {
	try {
		const res = await ky
			.get(authApi.refresh, {
				credentials: 'include',
			})
			.json<SuccessResponse>()

		if (res.status === 'success') {
			return true
		} else {
			return false
		}
	} catch (error) {
		console.error('Token refresh failed', error)
		return false
	}
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import ky from 'ky'
import { authApi } from './list'
import { SuccessResponse } from '~/types/auth'

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

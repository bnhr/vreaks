import ky from 'ky'
import { authApi } from './list'

export const AUTH_FAILED_EVENT = 'auth-failed'

const refreshTokenClient = ky.create({
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	credentials: 'include',
	timeout: 30000,
})

async function refreshAccessToken(): Promise<boolean> {
	try {
		const res = await refreshTokenClient.post(authApi.refresh)
		return res.ok
	} catch (error) {
		console.error('Token refresh failed', error)
		return false
	}
}

export const apiClient = ky.create({
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	credentials: 'include',
	timeout: 30000,
	retry: {
		limit: 2,
		methods: ['get', 'post', 'put', 'patch', 'delete'],
		statusCodes: [401, 500, 502, 503, 504],
	},
	hooks: {
		beforeRetry: [
			async ({ retryCount }) => {
				if (retryCount < 2) {
					const tokenRefreshed = await refreshAccessToken()
					if (!tokenRefreshed) {
						return ky.stop
					}
				} else {
					window.dispatchEvent(new CustomEvent(AUTH_FAILED_EVENT))
					return ky.stop
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

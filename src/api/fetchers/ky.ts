/* eslint-disable @typescript-eslint/no-unused-vars */
import Cookies from 'js-cookie'
import ky from 'ky'
import { authApi } from '../list'
import { LoginData } from '~/types/auth'

export const kyAPI = ky.create({
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
	timeout: 30000,
	retry: {
		limit: 2,
		methods: ['get', 'post', 'put', 'patch', 'delete'],
		statusCodes: [401, 500, 502, 503, 504],
	},
	hooks: {
		beforeRequest: [
			async (request) => {
				console.log('🚀 ~ request:', request)
				const token = Cookies.get('token')
				if (token) {
					request.headers.set('Authorization', `Bearer ${token}`)
				}
			},
		],
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

// token refresh function
async function refreshAccessToken() {
	try {
		const refresh = Cookies.get('refresh')
		if (!refresh) throw new Error('No refresh token')

		const res = await ky
			.post(authApi.refresh, {
				headers: { Authorization: `Bearer ${refresh}` },
			})
			.json<LoginData>()

		if (res.status === 'success') {
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
}

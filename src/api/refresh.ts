import wretch from 'wretch'
import Cookies from 'js-cookie'
import { authApi } from './list'

function generateToken() {
	const token = Cookies.get('refresh')
	const result = wretch(authApi.refresh)
		.auth(`Bearer ${token}`)
		.get()
		.json((res) => {
			if (res.statusCode === 200) {
				Cookies.set('token', res.data.accessToken, {
					expires: 1,
					path: '/',
					secure: true,
				})
				Cookies.set('refresh', res.data.refreshToken, {
					expires: 1,
					path: '/',
					secure: true,
				})
			}
		})
	return result
}

export default generateToken

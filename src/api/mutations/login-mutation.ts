import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { Fetcher } from '~/api/fetcher'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type LoginPayload = {
	username: string
	password: string
}

interface Result {
	accessToken: string
	refreshToken: string
}

interface Data {
	data: Result
}

function LoginMutation() {
	const mutation = useMutation({
		mutationFn: async (payload: LoginPayload) => {
			return await Fetcher<Data>('/auth/login', 'POST', false, payload)
		},
		onSuccess: (data) => {
			Cookies.set('auth', data.data.accessToken, {
				expires: 1,
				secure: true,
				path: '/',
			})
			Cookies.set('authr', data.data.refreshToken, {
				expires: 1,
				secure: true,
				path: '/',
			})
		},
		onError: (error) => {
			console.log(
				'🚀 ~ file: login-mutation.ts:15 ~ LoginMutation ~ error:',
				error,
			)
		},
	})

	return mutation
}

export default LoginMutation

import { ofetch } from 'ofetch'
import { BASEURL } from './list'
import Cookies from 'js-cookie'

type QueryParams = Record<string, string | number | boolean>
type BodyPayload = Record<
	string,
	string | number | boolean | string[] | number[] | boolean[]
>
const apiFetch = ofetch.create({ baseURL: BASEURL })

/**
 * This function makes an API request and returns the response data.
 *
 * @async
 * @template TResponse The expected response type.
 * @param {string} url The URL to make the POST request to.
 * @param {'GET' | 'POST'} method The HTTP method.
 * @param {boolean} hasAuth Indicates whether the request requires authentication.
 * @param {BodyPayload} payload Optional payload if the method is POST.
 * @param {QueryParams} [query] Optional query parameters for the POST request.
 * @returns {Promise<TResponse>} The response data from the POST request.
 * @throws Will throw an error if the response status is not OK.
 */
async function Fetcher<TResponse>(
	url: string,
	method: 'GET' | 'POST',
	hasAuth: boolean,
	payload?: BodyPayload,
	query?: QueryParams,
): Promise<TResponse> {
	const headers: Record<string, string> = {}

	const token = Cookies.get('auth')

	if (hasAuth) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const data: TResponse = await apiFetch(`${url}`, {
		method,
		headers,
		query: query,
		body: payload,
		async onRequestError({ request, error }) {
			console.log('[onRequestError] error', request, error)
		},
		async onResponseError({ response }) {
			throw new Error(response.statusText)
		},
	})
	return data
}

export { Fetcher }

import { DMYProps, DateInputProps } from '~/shared/types/common'

export function stringToDate(str: DateInputProps) {
	return new Date(str)
}

export function DMYFormat(date: DateInputProps, type: DMYProps) {
	const formattedDate = stringToDate(date)
	const dates = formattedDate.getDate().toString().padStart(2, '0')
	const months = (formattedDate.getMonth() + 1).toString().padStart(2, '0')
	const years = formattedDate.getFullYear()
	switch (type) {
		case 'DDMMYYYY':
			return `${dates}-${months}-${years}`
		case 'MMDDYYYY':
			return `${months}-${dates}-${years}`
		case 'YYYYMMDD':
			return `${years}-${months}-${dates}`
		default:
			return `${dates}-${months}-${years}`
	}
}

export function formatDateTime(date: DateInputProps) {
	const d = stringToDate(date)
	const day = d.getUTCDate().toString().padStart(2, '0')
	const month = (d.getUTCMonth() + 1).toString().padStart(2, '0')
	const year = d.getUTCFullYear()
	const hours = d.getUTCHours().toString().padStart(2, '0')
	const minutes = d.getUTCMinutes().toString().padStart(2, '0')
	const seconds = d.getUTCSeconds().toString().padStart(2, '0')
	return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`
}

export function stringDateFormat(
	date: DateInputProps,
	type: 'short' | 'long',
	lang: 'id' | 'en',
) {
	return stringToDate(date).toLocaleDateString(
		lang === 'en' ? 'en-US' : 'id-ID',
		{
			month: type === 'short' ? 'short' : 'long',
			day: 'numeric',
			year: 'numeric',
		},
	)
}

export function cookieExpiration(input: number) {
	const now = new Date()
	const expTime = now.getTime() + input * 60 * 1000
	return expTime
}

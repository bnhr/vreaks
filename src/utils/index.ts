/* eslint-disable indent */
import clsx from 'clsx'
import { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { DMYProps, DateInputProps } from '~/types'

export function truncateText(text: string, length: number) {
	let truncated = text.slice(0, length + 1)
	if (truncated.length === length + 1) {
		truncated += '...'
	}
	return truncated
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function stringToDate(str: DateInputProps) {
	return new Date(str)
}

export function DMYFormat(date: DateInputProps, type: DMYProps) {
	const formattedDate = stringToDate(date)
	const dates = formattedDate.getDate()
	const months = formattedDate.getMonth() + 1
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
	// const expDate = new Date(expTime)
	return expTime
}

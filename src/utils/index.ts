import clsx from 'clsx'
import { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

import { describe, expect, it } from 'vitest'

import { DMYFormat, stringDateFormat, truncateText } from '.'

describe('truncate long text', () => {
	it('should works properly', () => {
		const trunt = truncateText('Hello world', 4)
		expect(trunt).toBe('Hello...')
	})
})

describe('Formatting Date', () => {
	it('should returns date in DMY format correctly', () => {
		const today = DMYFormat(1703395595232, 'DDMMYYYY')
		expect(today).toBe('24-12-2023')
		const tomorrow = DMYFormat('2023-12-25T05:37:27.522Z', 'MMDDYYYY')
		expect(tomorrow).toBe('12-25-2023')
	})

	it('should returns date as string correctly', () => {
		const today = stringDateFormat(1703395595232, 'long', 'en')
		expect(today).toBe('December 24, 2023')
		const tomorrow = stringDateFormat('2023-12-25T05:37:27.522Z', 'short', 'id')
		expect(tomorrow).toBe('25 Des 2023')
	})
})

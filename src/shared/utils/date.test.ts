import { describe, expect, it } from 'vitest'
import {
	DMYFormat,
	stringDateFormat,
	stringToDate,
	cookieExpiration,
	formatDateTime,
} from './date'

describe('Formatting Date', () => {
	it('should returns date in DMY format correctly', () => {
		const today = DMYFormat(1703395595232, 'DDMMYYYY')
		expect(today).toBe('24-12-2023')
		const tomorrow = DMYFormat('2023-12-25T05:37:27.522Z', 'MMDDYYYY')
		expect(tomorrow).toBe('12-25-2023')
	})

	it('should handle YYYYMMDD format', () => {
		const result = DMYFormat('2023-12-25T05:37:27.522Z', 'YYYYMMDD')
		expect(result).toBe('2023-12-25')
	})

	it('should returns date as string correctly', () => {
		const today = stringDateFormat(1703395595232, 'long', 'en')
		expect(today).toBe('December 24, 2023')
		const tomorrow = stringDateFormat('2023-12-25T05:37:27.522Z', 'short', 'id')
		expect(tomorrow).toBe('25 Des 2023')
	})

	it('should handle short format in English', () => {
		const result = stringDateFormat('2023-12-25T05:37:27.522Z', 'short', 'en')
		expect(result).toBe('Dec 25, 2023')
	})

	it('should handle long format in Indonesian', () => {
		const result = stringDateFormat('2023-12-25T05:37:27.522Z', 'long', 'id')
		expect(result).toBe('25 Desember 2023')
	})

	it('should format date and time correctly', () => {
		const result = formatDateTime(1703395595232)
		expect(result).toBe('24-12-2023-05-26-35')
	})
})

describe('String to Date conversion', () => {
	it('should convert timestamp number to Date', () => {
		const result = stringToDate(1703395595232)
		expect(result).toBeInstanceOf(Date)
		expect(result.getTime()).toBe(1703395595232)
	})

	it('should convert ISO string to Date', () => {
		const result = stringToDate('2023-12-25T05:37:27.522Z')
		expect(result).toBeInstanceOf(Date)
		expect(result.toISOString()).toBe('2023-12-25T05:37:27.522Z')
	})

	it('should convert date string to Date', () => {
		const result = stringToDate('2023-12-25')
		expect(result).toBeInstanceOf(Date)
		expect(result.getFullYear()).toBe(2023)
		expect(result.getMonth()).toBe(11) // December is 11
		expect(result.getDate()).toBe(25)
	})
})

describe('Cookie expiration', () => {
	it('should calculate expiration time correctly', () => {
		const now = Date.now()
		const result = cookieExpiration(5) // 5 minutes
		expect(result).toBe(now + 5 * 60 * 1000)
	})

	it('should handle zero minutes', () => {
		const now = Date.now()
		const result = cookieExpiration(0)
		expect(result).toBe(now)
	})

	it('should handle large values', () => {
		const now = Date.now()
		const result = cookieExpiration(1440) // 24 hours
		expect(result).toBe(now + 1440 * 60 * 1000)
	})
})

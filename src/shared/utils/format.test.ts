import { describe, expect, it } from 'vitest'
import { truncateText } from './format'

describe('truncate long text', () => {
	it('should works properly', () => {
		const trunt = truncateText('Hello world', 4)
		expect(trunt).toBe('Hello...')
	})

	it('should return original text if shorter than length', () => {
		const result = truncateText('Hi', 5)
		expect(result).toBe('Hi')
	})

	it('should handle empty string', () => {
		const result = truncateText('', 5)
		expect(result).toBe('')
	})

	it('should handle exact length', () => {
		const result = truncateText('Hello', 5)
		expect(result).toBe('Hello')
	})
})

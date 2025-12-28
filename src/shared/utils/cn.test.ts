import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('Class name utility', () => {
	it('should merge class names correctly', () => {
		const result = cn('class1', 'class2')
		expect(result).toBe('class1 class2')
	})

	it('should handle conditional classes', () => {
		const isActive = true
		const isInactive = false
		const result = cn('base', isActive && 'active', isInactive && 'inactive')
		expect(result).toBe('base active')
	})

	it('should merge Tailwind classes correctly', () => {
		const result = cn('px-4 py-2', 'px-6')
		expect(result).toContain('px-6')
		expect(result).toContain('py-2')
	})

	it('should handle empty inputs', () => {
		const result = cn()
		expect(result).toBe('')
	})
})

import { describe, expect, it } from 'vitest'

import { truncateText } from '.'

describe('truncate long text', () => {
	it('should works properly', () => {
		const trunt = truncateText('Hello world', 4)
		expect(trunt).toBe('Hello...')
	})
})

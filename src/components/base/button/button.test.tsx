import { describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '~/utils/test-utils'

import Button from './button'

describe('Should render button component properly', () => {
	it('Render button with text of Sign Up', () => {
		render(<Button>Sign Up</Button>)
		expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
	})

	it('Should print sign in to the console when clicked', () => {
		const fn = vi.fn().mockImplementation(() => console.log('Sign in'))
		render(<Button onClick={fn}>Sign in...</Button>)
		fireEvent.click(screen.getByRole('button', { name: /Sign In.../i }))
		expect(fn).toBeCalledTimes(1)
	})

	it('Should be disabled and ignore any events', () => {
		const fn = vi.fn().mockImplementation(() => console.log('hello'))
		render(
			<Button onClick={fn} disabled>
				button
			</Button>,
		)
		fireEvent.click(screen.getByRole('button', { name: /button/i }))
		expect(screen.getByRole('button', { name: /button/i })).toBeDisabled()
		expect(fn).toBeCalledTimes(0)
	})
})

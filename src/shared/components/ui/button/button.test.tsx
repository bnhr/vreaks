import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../../test'

import Button from './button'

describe('Should render button component properly', () => {
	it('Render button with text of Sign Up', () => {
		renderWithProviders(<Button>Sign Up</Button>)
		expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument()
	})

	it('Should print sign in to the console when clicked', async () => {
		const user = userEvent.setup()
		const fn = vi.fn().mockImplementation(() => console.log('Sign in'))
		renderWithProviders(<Button onClick={fn}>Sign in...</Button>)
		await user.click(screen.getByRole('button', { name: /Sign In.../i }))
		expect(fn).toBeCalledTimes(1)
	})

	it('Should be disabled and ignore any events', async () => {
		const user = userEvent.setup()
		const fn = vi.fn().mockImplementation(() => console.log('hello'))
		renderWithProviders(
			<Button
				onClick={fn}
				disabled
			>
				button
			</Button>,
		)
		// Disabled buttons should not respond to clicks
		await user.click(screen.getByRole('button', { name: /button/i }))
		expect(screen.getByRole('button', { name: /button/i })).toBeDisabled()
		expect(fn).toBeCalledTimes(0)
	})
})

import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ children, type = 'button', ...rest }: ButtonProps) => {
	return (
		<button
			type={type}
			{...rest}
		>
			{children}
		</button>
	)
}

Button.displayName = 'Button'

export default Button

import { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({
	ref: _ref,
	...props
}: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
	const { children, type = 'button', onClick, ...rest } = props
	return (
		<button
			ref={_ref}
			type={type}
			onClick={onClick}
			{...rest}
		>
			{children}
		</button>
	)
}

Button.displayName = 'Button'

export default Button

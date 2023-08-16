import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, _ref) => {
	const { children, type } = props
	return (
		<button ref={_ref} {...props} type={type ?? 'button'}>
			{children}
		</button>
	)
})

Button.displayName = 'Button'

export default Button

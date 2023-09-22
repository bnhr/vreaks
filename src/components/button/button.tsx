import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, _ref) => {
	const { children, type, onClick, ...rest } = props
	return (
		<button ref={_ref} type={type ?? 'button'} onClick={onClick} {...rest}>
			{children}
		</button>
	)
})

Button.displayName = 'Button'

export default Button

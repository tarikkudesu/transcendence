interface ButtonProps {
	label: string;
	onClick?: () => void;
	variant?: 'primary' | 'secondary' | 'danger';
	size?: 'small' | 'medium' | 'large';
	disabled?: boolean;
	fullWidth?: boolean;
	type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
	label,
	onClick,
	variant = 'primary',
	size = 'medium',
	disabled = false,
	fullWidth = false,
	type = 'button',
}) => {
	// Tailwind classes based on props
	const baseStyles =
		'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	// Variant styles
	const variantStyles = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
	};

	// Size styles
	const sizeStyles = {
		small: 'text-sm px-3 py-1',
		medium: 'text-base px-4 py-2',
		large: 'text-lg px-6 py-3',
	};

	// Disabled styles
	const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

	// Width styles
	const widthStyles = fullWidth ? 'w-full' : '';

	const buttonClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${disabledStyles}
      ${widthStyles}
    `;

	return (
		<button type={type} className={buttonClasses} onClick={onClick} disabled={disabled}>
			{label}
		</button>
	);
};

export default Button;

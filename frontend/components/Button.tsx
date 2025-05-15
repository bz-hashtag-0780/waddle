import React from 'react';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'primary' | 'secondary' | 'outline' | 'danger';
	size?: 'sm' | 'md' | 'lg';
	fullWidth?: boolean;
	isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	disabled = false,
	className = '',
	type = 'button',
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	isLoading = false,
}) => {
	// Define base styles
	const baseStyles =
		'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

	// Define variant styles
	const variantStyles = {
		primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		secondary:
			'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
		outline:
			'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
	};

	// Define size styles
	const sizeStyles = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-5 py-2.5 text-lg',
	};

	// Combine all styles
	const buttonStyles = [
		baseStyles,
		variantStyles[variant],
		sizeStyles[size],
		fullWidth ? 'w-full' : '',
		disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '',
		className,
	].join(' ');

	return (
		<button
			type={type}
			className={buttonStyles}
			onClick={onClick}
			disabled={disabled || isLoading}
		>
			{isLoading ? (
				<div className="mr-2">
					<svg
						className="animate-spin h-4 w-4 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</div>
			) : null}
			{children}
		</button>
	);
};

export default Button;

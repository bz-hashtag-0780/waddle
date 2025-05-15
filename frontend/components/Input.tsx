import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	fullWidth?: boolean;
	className?: string;
}

const Input: React.FC<InputProps> = ({
	label,
	error,
	fullWidth = false,
	className = '',
	...props
}) => {
	return (
		<div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
			{label && (
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</label>
			)}
			<input
				className={`block border ${
					error
						? 'border-red-500 focus:ring-red-500'
						: 'border-gray-300 focus:ring-blue-500'
				} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent py-2 px-3 text-gray-900 ${
					fullWidth ? 'w-full' : ''
				}`}
				{...props}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
};

export default Input;

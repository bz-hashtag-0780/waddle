import React from 'react';

interface CardProps {
	children: React.ReactNode;
	title?: string;
	description?: string;
	className?: string;
	footer?: React.ReactNode;
	headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
	children,
	title,
	description,
	className = '',
	footer,
	headerAction,
}) => {
	return (
		<div
			className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}
		>
			{(title || description || headerAction) && (
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<div>
							{title && (
								<h3 className="text-lg font-medium text-gray-900">
									{title}
								</h3>
							)}
							{description && (
								<p className="mt-1 text-sm text-gray-500">
									{description}
								</p>
							)}
						</div>
						{headerAction && <div>{headerAction}</div>}
					</div>
				</div>
			)}
			<div className="px-6 py-5">{children}</div>
			{footer && (
				<div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
					{footer}
				</div>
			)}
		</div>
	);
};

export default Card;

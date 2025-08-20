'use client';

import React from 'react';

export function PongButton({
	onClick,
	className,
	children,
}: {
	onClick?: () => void;
	className?: string;
	children?: React.ReactNode;
}): React.ReactNode {
	return (
		<button
			onClick={onClick}
			className={`${className} text-sm font-bold px-4 py-2.5 text-center flex justify-center items-center gap-2 duration-150 rounded-sm`}
		>
			{children}
		</button>
	);
}

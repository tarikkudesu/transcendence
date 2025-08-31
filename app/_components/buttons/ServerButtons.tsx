'use client';

import { SvgSpinner } from '@/app/_svg/svg';
import React from 'react';

export function PongButton({
	loading,
	disabled,
	onClick,
	className,
	children,
}: {
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	loading?: boolean;
	children?: React.ReactNode;
}): React.ReactNode {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`${className} text-sm font-bold px-4 py-2.5 text-center flex cursor-pointer
						 justify-center items-center gap-2 duration-150 rounded-md
						 overflow-hidden relative`}
		>
			{loading ? <SvgSpinner className="animate-spin" size={24} /> : children}
		</button>
	);
}

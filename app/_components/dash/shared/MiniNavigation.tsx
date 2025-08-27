'use client';

import { visitable } from '@/app/_service/consts';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const MiniNavigation: React.FC = () => {
	const router = useRouter();
	const pathname = usePathname();
	const segments = pathname.split('/').filter(Boolean);

	const buildPath = (index: number) => '/' + segments.slice(0, index + 1).join('/');

	const onNavigate = useCallback((path: string) => {
		if (visitable.some((ele) => ele === path)) router.push(path);
	}, []);

	return (
		<div className="flex items-center text-dark-200 text-sm my-[20px]">
			{segments.map((segment, index) => (
				<React.Fragment key={index}>
					{index !== 0 && (
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={16} width={16} className="text-dark-200 mx-2">
							<path
								fill="currentColor"
								d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"
							/>
						</svg>
					)}
					<button
						onClick={() => onNavigate(buildPath(index))}
						className={`hover:text-white ${pathname === buildPath(index) ? 'text-white' : ''}`}
					>
						{segment}
					</button>
				</React.Fragment>
			))}
		</div>
	);
};

export default MiniNavigation;

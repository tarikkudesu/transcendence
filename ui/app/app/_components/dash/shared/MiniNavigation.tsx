'use client';

import { SvgChevronLeft } from '@/app/_svg/svg';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

const MiniNavigation: React.FC = () => {
	const router = useRouter();

	const onNavigate = useCallback(() => {
		router.back();
	}, [router]);

	return (
		<div className="flex items-center text-dark-200 text-sm my-[12px]">
			<div onClick={onNavigate} className="">
				<SvgChevronLeft size={22} className="text-dark-200 hover:text-accent-300 duration-150 cursor-pointer" />
			</div>
		</div>
	);
};

export default MiniNavigation;

'use client';

import { SvgArmor, SvgChatBubles, SvgGameBoy, SvgQueen } from '@/app/_svg/svg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navigation: React.FC = ({}) => {
	const pathname = usePathname();

	return (
		<div className="flex flex-col gap-2">
			<Link href="/playground">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/playground' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<SvgGameBoy size={20} />
					Playground
				</div>
			</Link>
			<Link href="/tournament">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/tournament' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<SvgArmor size={20} />
					Tournament
				</div>
			</Link>
			<Link href="/leaderboard">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/leaderboard' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<SvgQueen size={20} />
					Leaderboard
				</div>
			</Link>
			<Link href="/chat">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/chat' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<SvgChatBubles size={20} />
					Chat
				</div>
			</Link>
		</div>
	);
};

export default Navigation;

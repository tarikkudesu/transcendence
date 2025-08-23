'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navigation: React.FC = ({}) => {
	const pathname = usePathname();

	return (
		<div className="flex flex-col gap-2">
			<Link href="/main/dashboard/playground">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/main/dashboard/playground' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
						<path
							fill="currentColor"
							d="M448 128C554 128 640 214 640 320C640 426 554 512 448 512L192 512C86 512 0 426 0 320C0 214 86 128 192 128L448 128zM192 240C178.7 240 168 250.7 168 264L168 296L136 296C122.7 296 112 306.7 112 320C112 333.3 122.7 344 136 344L168 344L168 376C168 389.3 178.7 400 192 400C205.3 400 216 389.3 216 376L216 344L248 344C261.3 344 272 333.3 272 320C272 306.7 261.3 296 248 296L216 296L216 264C216 250.7 205.3 240 192 240zM432 336C414.3 336 400 350.3 400 368C400 385.7 414.3 400 432 400C449.7 400 464 385.7 464 368C464 350.3 449.7 336 432 336zM496 240C478.3 240 464 254.3 464 272C464 289.7 478.3 304 496 304C513.7 304 528 289.7 528 272C528 254.3 513.7 240 496 240z"
						/>
					</svg>
					Playground
				</div>
			</Link>
			<Link href="/main/dashboard/tournament">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/main/dashboard/tournament' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
						<path
							fill="currentColor"
							d="M320 64C324.6 64 329.2 65 333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.6 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64z"
						/>
					</svg>
					Tournament
				</div>
			</Link>
			<Link href="/main/dashboard/leaderboard">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/main/dashboard/leaderboard' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
						<path
							fill="currentColor"
							d="M320 144C346.5 144 368 122.5 368 96C368 69.5 346.5 48 320 48C293.5 48 272 69.5 272 96C272 122.5 293.5 144 320 144zM69.5 249L192 448L135.8 518.3C130.8 524.6 128 532.4 128 540.5C128 560.1 143.9 576 163.5 576L476.4 576C496 576 511.9 560.1 511.9 540.5C511.9 532.4 509.2 524.6 504.1 518.3L448 448L570.5 249C574.1 243.1 576 236.3 576 229.4L576 228.8C576 208.5 559.5 192 539.2 192C531.9 192 524.8 194.2 518.8 198.2L501.9 209.5C489.2 218 472.3 216.3 461.5 205.5L427.4 171.4C420.1 164.1 410.2 160 400 160C389.8 160 379.9 164.1 372.7 171.3L342.6 201.4C330.1 213.9 309.8 213.9 297.3 201.4L267.2 171.3C260.1 164.1 250.2 160 240 160C229.8 160 219.9 164.1 212.7 171.3L178.6 205.4C167.8 216.2 150.9 217.9 138.2 209.4L121.3 198.2C115.2 194.2 108.1 192 100.9 192C80.6 192 64.1 208.5 64.1 228.8L64.1 229.4C64.1 236.3 66 243.1 69.6 249z"
						/>
					</svg>
					Leaderboard
				</div>
			</Link>
			<Link href="/main/dashboard/chat">
				<div
					className={`py-3 px-4 text-sm font-bold hover:bg-dark-700 rounded-md flex justify-start items-center gap-4 cursor-pointer duration-200 ${
						pathname === '/main/dashboard/chat' ? 'text-accent-300' : 'text-dark-100'
					}`}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={20} width={20}>
						<path
							fill="currentColor"
							d="M416 208C416 305.2 330 384 224 384C197.3 384 171.9 379 148.8 370L67.2 413.2C57.9 418.1 46.5 416.4 39 409C31.5 401.6 29.8 390.1 34.8 380.8L70.4 313.6C46.3 284.2 32 247.6 32 208C32 110.8 118 32 224 32C330 32 416 110.8 416 208zM416 576C321.9 576 243.6 513.9 227.2 432C347.2 430.5 451.5 345.1 463 229.3C546.3 248.5 608 317.6 608 400C608 439.6 593.7 476.2 569.6 505.6L605.2 572.8C610.1 582.1 608.4 593.5 601 601C593.6 608.5 582.1 610.2 572.8 605.2L491.2 562C468.1 571 442.7 576 416 576z"
						/>
					</svg>
					Chat
				</div>
			</Link>
		</div>
	);
};

export default Navigation;

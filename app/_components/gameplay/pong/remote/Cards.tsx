import Link from 'next/link';

const Spinner: React.FC<{ size: number }> = ({ size }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={size} width={size} className="text-accent-900 animate-spin">
			<path
				fill="currentColor"
				d="M286.7 96.1C291.7 113 282.1 130.9 265.2 135.9C185.9 159.5 128.1 233 128.1 320C128.1 426 214.1 512 320.1 512C426.1 512 512.1 426 512.1 320C512.1 233.1 454.3 159.6 375 135.9C358.1 130.9 348.4 113 353.5 96.1C358.6 79.2 376.4 69.5 393.3 74.6C498.9 106.1 576 204 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320C64 204 141.1 106.1 246.9 74.6C263.8 69.6 281.7 79.2 286.7 96.1z"
			/>
		</svg>
	);
};

const Wifi: React.FC<{ size: number }> = ({ size }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={size} width={size} className="text-red-200">
			<path
				fill="currentColor"
				d="M320 160C229.1 160 146.8 196 86.3 254.6C73.6 266.9 53.3 266.6 41.1 253.9C28.9 241.2 29.1 220.9 41.8 208.7C113.7 138.9 211.9 96 320 96C428.1 96 526.3 138.9 598.3 208.7C611 221 611.3 241.3 599 253.9C586.7 266.5 566.4 266.9 553.8 254.6C493.2 196 410.9 160 320 160zM272 496C272 469.5 293.5 448 320 448C346.5 448 368 469.5 368 496C368 522.5 346.5 544 320 544C293.5 544 272 522.5 272 496zM200 390.2C188.3 403.5 168.1 404.7 154.8 393C141.5 381.3 140.3 361.1 152 347.8C193 301.4 253.1 272 320 272C386.9 272 447 301.4 488 347.8C499.7 361.1 498.4 381.3 485.2 393C472 404.7 451.7 403.4 440 390.2C410.6 356.9 367.8 336 320 336C272.2 336 229.4 356.9 200 390.2z"
			/>
		</svg>
	);
};

interface WaitingProps {
	player: string;
}

export const Waiting: React.FC<WaitingProps> = ({ player }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-dark-900 rounded-md"></div>
					<div className="absolute bottom-4 left-4 text-accent-500/20"></div>
					<div className="relative z-10 text-center">
						<div className="flex justify-center mb-6">
							<div className={'p-4 rounded-full shadow-lg bg-accent-300'}>
								<Spinner size={32} />
							</div>
						</div>
						<h2 className="text-2xl font-bold mb-2 text-accent-300">Connecting...</h2>
						<p className="text-md font-bold text-white">Waiting for {player}</p>
						<p className="text-xs font-bold text-dark-300 pt-1">Please wait while we establish connection</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Disconnected: React.FC<WaitingProps> = ({ player }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-orange-950/25 rounded-md"></div>
					<div className="absolute bottom-4 left-4 text-accent-500/20"></div>
					<div className="relative z-10 text-center">
						<div className="flex justify-center mb-6">
							<div className={'p-4 rounded-full shadow-lg bg-red-600'}>
								<Wifi size={32} />
							</div>
						</div>
						<h2 className="text-2xl font-bold mb-2 text-red-500">Disonnected</h2>
						<p className="text-md font-bold text-white">Lost connection with {player}</p>
						<p className="text-xs font-bold text-dark-300 pt-1">It seems that the other player has left the room</p>
						<Link href="/dash/board/playground">
							<button className="py-2 my-2 px-4 text-center bg-accent-300 text-xs text-black rounded-sm cursor-pointer font-bold">
								Playground
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};


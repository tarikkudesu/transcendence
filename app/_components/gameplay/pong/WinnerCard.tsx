const Star: React.FC<{ size: number }> = ({ size }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={size} width={size} className={'text-golden-500'}>
			<path
				fill="currentColor"
				d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
			/>
		</svg>
	);
};

const Trophy: React.FC<{ size: number }> = ({ size }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={size} width={size} className="text-black">
			<path
				fill="currentColor"
				d="M208.3 64L432.3 64C458.8 64 480.4 85.8 479.4 112.2C479.2 117.5 479 122.8 478.7 128L528.3 128C554.4 128 577.4 149.6 575.4 177.8C567.9 281.5 514.9 338.5 457.4 368.3C441.6 376.5 425.5 382.6 410.2 387.1C390 415.7 369 430.8 352.3 438.9L352.3 512L416.3 512C434 512 448.3 526.3 448.3 544C448.3 561.7 434 576 416.3 576L224.3 576C206.6 576 192.3 561.7 192.3 544C192.3 526.3 206.6 512 224.3 512L288.3 512L288.3 438.9C272.3 431.2 252.4 416.9 233 390.6C214.6 385.8 194.6 378.5 175.1 367.5C121 337.2 72.2 280.1 65.2 177.6C63.3 149.5 86.2 127.9 112.3 127.9L161.9 127.9C161.6 122.7 161.4 117.5 161.2 112.1C160.2 85.6 181.8 63.9 208.3 63.9zM165.5 176L113.1 176C119.3 260.7 158.2 303.1 198.3 325.6C183.9 288.3 172 239.6 165.5 176zM444 320.8C484.5 297 521.1 254.7 527.3 176L475 176C468.8 236.9 457.6 284.2 444 320.8z"
			/>
		</svg>
	);
};

interface WinnerCardProps {
	winner: string;
}

const WinnerCard: React.FC<WinnerCardProps> = ({ winner }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-dark-900 rounded-md"></div>
					<div className="absolute bottom-4 left-4 text-golden-500/20">
						<Star size={24} />
					</div>
					<div className="relative z-10 text-center">
						<div className="flex justify-center mb-6">
							<div className={'p-4 rounded-full shadow-lg bg-golden-500'}>
								<Trophy size={24} />
							</div>
						</div>
						<h2 className="text-2xl font-bold text-gray-100 mb-2">Winner</h2>
						<div className="bg-dark-950 rounded-md p-2 border border-dark-500">
							<p className="text-md font-bold text-white break-words">{winner}</p>
						</div>
						<div className="mt-6 h-1 bg-gradient-to-r from-transparent via-golden-500 to-transparent rounded-full"></div>
					</div>
				</div>
				<div className="absolute -top-2 -left-2 text-golden-500 animate-pulse">
					<Star size={16} />
				</div>
				<div className="absolute -top-2 -right-2 text-golden-500 animate-pulse delay-300">
					<Star size={16} />
				</div>
				<div className="absolute -bottom-2 -left-2 text-golden-500 animate-pulse delay-700">
					<Star size={16} />
				</div>
				<div className="absolute -bottom-2 -right-2 text-golden-500 animate-pulse delay-1000">
					<Star size={16} />
				</div>
			</div>
		</div>
	);
};
export default WinnerCard;

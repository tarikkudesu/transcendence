import { SvgPlay, SvgSpinner, SvgStar, SvgTrophy, SvgWifi } from '@/app/_svg/svg';
import { PongButton } from '../buttons/ServerButtons';

interface CardsProps {
	player: string;
	opponent: string;
}

export const Waiting: React.FC<CardsProps> = ({ player }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-cardenter">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute inset-0 bg-dark-900 rounded-md"></div>
					<div className="absolute bottom-4 left-4 text-accent-500/20"></div>
					<div className="relative z-10 text-center">
						<div className="flex justify-center mb-6">
							<div className={'p-4 rounded-full shadow-lg bg-accent-300'}>
								<SvgSpinner size={32} className="text-black animate-spin" />
							</div>
						</div>
						<h2 className="text-2xl font-bold mb-2 text-accent-300">Connecting...</h2>
						<p className="text-sm font-bold text-white">Waiting for {player}</p>
						<p className="text-xs font-bold text-dark-300 pt-1">Please wait while we establish connection</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Won: React.FC<CardsProps> = ({ player }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-cardenter">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[100px] shadow-lg bg-accent-300">
						<SvgTrophy size={40} />
					</div>
					<div className="mt-[100px] relative z-10 text-center">
						<h2 className="text-2xl font-bold mb-2 text-accent-300">Victory 🎊</h2>
						<p className="text-sm font-bold text-white">
							Congratulations, <span className="text-accent-300">{player}</span>!
						</p>
						<p className="text-xs font-bold text-dark-300 pt-1">Every match you win is a step closer to greatness</p>
						<div className="grid grid-cols-2 gap-3 mt-6">
							<PongButton className="bg-dark-700 hover:bg-accent-300 hover:text-black" onClick={() => confirm}>
								Rematch
							</PongButton>
							<PongButton className="bg-dark-700 hover:bg-accent-300 hover:text-black" onClick={() => confirm}>
								Chat
							</PongButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Lost: React.FC<CardsProps> = ({ player }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-cardenter">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[100px] shadow-lg bg-dark-500">
						<SvgTrophy size={40} />
					</div>
					<div className="mt-[100px] relative z-10 text-center">
						<h2 className="text-2xl font-bold mb-2 text-accent-300">Good Effort 💪</h2>
						<p className="text-sm font-bold text-white">
							Keep trying, <span className="text-accent-300">{player}</span>!
						</p>
						<p className="text-xs font-bold text-dark-300 pt-1">There is always a chance to revenge</p>
						<div className="grid grid-cols-2 gap-3 mt-6">
							<PongButton className="bg-dark-700 hover:bg-accent-300 hover:text-black" onClick={() => confirm}>
								Rematch
							</PongButton>
							<PongButton className="bg-dark-700 hover:bg-accent-300 hover:text-black" onClick={() => confirm}>
								Chat
							</PongButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Disconnected: React.FC<CardsProps> = ({ player }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-cardenter">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute inset-0 rounded-md"></div>
					<div className="relative text-center">
						<div className="flex justify-center mb-6">
							<div className={'p-4 rounded-full shadow-lg bg-red-600'}>
								<SvgWifi size={24} />
							</div>
						</div>
						<h2 className="text-2xl font-bold mb-2 text-red-500">Disonnected</h2>
						<p className="text-xs font-bold text-white">Lost connection with {player}</p>
						<p className="text-xs font-bold text-dark-300 pt-1">It seems that the other player has left the room</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export const StartLocal: React.FC = () => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-cardenter">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[100px] shadow-lg bg-golden-500">
						<SvgPlay size={40} className="translate-x-0.5 text-black" />
					</div>
					<div className="mt-[100px] relative z-10 text-center">
						<h2 className="text-2xl font-bold mb-2 text-golden-500">Ready to start 💪</h2>
						<p className="text-sm font-bold text-white">What are you waiting for?</p>
						<p className="text-xs font-bold text-dark-300 pt-1">Paying in real life is much more fun</p>
						<PongButton
							onClick={() => confirm}
							className="w-full bg-dark-700 hover:bg-golden-500 text-white hover:text-black mt-6"
						>
							Playground
						</PongButton>
					</div>
				</div>
			</div>
		</div>
	);
};

interface WonLocalProps {
	winner: string;
}

export const WonLocal: React.FC<WonLocalProps> = ({ winner }) => {
	return (
		<div className="w-[300px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-cardenter">
			<div className="relative">
				<div className="bg-dark-950 rounded-md p-8 shadow-2xl border border-dark-500 relative overflow-hidden">
					<div className="absolute top-0 left-0 right-0 flex justify-center items-center h-[100px] shadow-lg bg-golden-500">
						<SvgTrophy size={40} />
					</div>
					<div className="mt-[100px] relative z-10 text-center">
						<h2 className="text-2xl font-bold mb-2 text-golden-500">Victory 🎊</h2>
						<p className="text-sm font-bold text-white">
							Congratulations, <span className="text-golden-500">{winner}</span>!
						</p>
						<p className="text-xs font-bold text-dark-300 pt-1">Every match you win is a step closer to greatness</p>
					</div>
				</div>
				<div className="absolute -top-2 -left-2 text-golden-500 animate-pulse">
					<SvgStar size={16} />
				</div>
				<div className="absolute -top-2 -right-2 text-golden-500 animate-pulse delay-300">
					<SvgStar size={16} />
				</div>
				<div className="absolute -bottom-2 -left-2 text-golden-500 animate-pulse delay-700">
					<SvgStar size={16} />
				</div>
				<div className="absolute -bottom-2 -right-2 text-golden-500 animate-pulse delay-1000">
					<SvgStar size={16} />
				</div>
			</div>
		</div>
	);
};

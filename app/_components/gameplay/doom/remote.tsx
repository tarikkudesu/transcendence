'use client';

import { useUser } from '@/app/_service/user/userContext';
import { FlipMessage } from '@/app/_service/ws/game';
import { useDoomSocket } from '@/app/_service/ws/game/doomContext';
import SvgBomb from '@/app/_svg/SvgBomb';
import SvgCard from '@/app/_svg/SvgCard';
import SvgDiamond from '@/app/_svg/SvgDiamond';
import { Box, Grid } from '@radix-ui/themes';
import { User } from '../../dash/game/User';
import { Disconnected, LostDoom, Nothing, WaitingDoom, WonDoom } from '../Cards';

const Diamond: React.FC<{ state: string; index: number }> = ({ state, index }) => {
	const { send, gid } = useDoomSocket();

	if (state === 'B') return <SvgBomb />;
	else if (state === 'D') return <SvgDiamond />;
	return <SvgCard onClick={() => send(FlipMessage('card of doom', gid, index))} />;
};

const Doom: React.FC = () => {
	const { doom, open, won, lost, disconnected } = useDoomSocket();

	if (!doom) return null;

	return (
		<>
			<div className="flex justify-between mb-2">
				<div
					className="w-[80px] text-center rounded-sm py-1 text-sm font-bold px-3 bg-white text-black"
					style={{ opacity: !doom.myturn ? 1 : 0.5 }}
				>
					{!doom.myturn ? doom.timer : 10}
				</div>
				<div
					className="w-[80px] text-center rounded-sm py-1 text-sm font-bold px-3 bg-white text-black"
					style={{ opacity: doom.myturn ? 1 : 0.5 }}
				>
					{doom.myturn ? doom.timer : 10}
				</div>
			</div>
			<Box height="12px" />
			<Grid
				columns="5"
				rows="5"
				gap="5"
				style={{ opacity: !open || won || lost || disconnected ? 0.5 : 1 }}
				className="bg-dark-950 rounded-md shadow-xl min-h-[700px]"
			>
				{doom.cards.map((card, index) => (
					<div key={index} className="flex justify-center items-center">
						<Diamond state={card} index={index} />
					</div>
				))}
			</Grid>
		</>
	);
};

const RemoteDoom: React.FC<{ opponent: string }> = ({ opponent }) => {
	const { username } = useUser();
	const { doom: game, open, won, lost, disconnected } = useDoomSocket();

	function Content(): React.ReactNode {
		if (!open) return <WaitingDoom player={username} opponent={opponent} />;
		if (won) {
			return (
				<>
					<Doom />
					<WonDoom player={username} opponent={opponent} />
				</>
			);
		}
		if (lost) {
			return (
				<>
					<Doom />
					<LostDoom player={username} opponent={opponent} />
				</>
			);
		}
		if (disconnected && !won && !lost) return <Disconnected player={username} opponent={opponent} />;
		if (game) return <Doom />;
		return <Nothing />;
	}

	return (
		<div className="w-[800px] aspect-square relative mx-auto mb-6">
			{Content()}
			<div className="flex justify-between p-2">
				<User.Username username={opponent} className="font-bold text-orange-600 hover:text-orange-500" />
				<User.Username username={username} className="font-bold text-orange-600 hover:text-orange-500" />
			</div>
		</div>
	);
};

export default RemoteDoom;

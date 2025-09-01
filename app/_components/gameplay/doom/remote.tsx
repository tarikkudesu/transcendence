'use client';

import { useUser } from '@/app/_service/user/userContext';
import { FlipMessage } from '@/app/_service/ws/game';
import { useDoomSocket } from '@/app/_service/ws/game/doomContext';
import { SvgChat, SvgGameBoy } from '@/app/_svg/svg';
import SvgBomb from '@/app/_svg/SvgBomb';
import SvgCard from '@/app/_svg/SvgCard';
import SvgDiamond from '@/app/_svg/SvgDiamond';
import { Box, Grid } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { PongButton } from '../../buttons/ServerButtons';
import { User } from '../../dash/game/User';
import { DisconnectedDoom, LostDoom, WaitingDoom, WonDoom } from '../Cards';

const Diamond: React.FC<{ state: string; index: number }> = ({ state, index }) => {
	const { send, gid } = useDoomSocket();

	if (state === 'B') return <SvgBomb />;
	else if (state === 'D') return <SvgDiamond />;
	return <SvgCard onClick={() => send(FlipMessage('card of doom', gid, index))} />;
};

const Doom: React.FC = () => {
	const { doom, won, lost, disconnected } = useDoomSocket();

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
				style={{ opacity: won || lost || disconnected ? 0.5 : 1 }}
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
	const router = useRouter();
	const { username } = useUser();
	const { won, lost, disconnected, waiting } = useDoomSocket();

	const node = useCallback(() => {
		if (won) return <WonDoom player={username} opponent={opponent} />;
		if (lost) return <LostDoom player={username} opponent={opponent} />;
		if (waiting) return <WaitingDoom player={username} opponent={opponent} />;
		if (disconnected) return <DisconnectedDoom player={username} opponent={opponent} />;
		return <Doom />;
	}, [disconnected, lost, opponent, username, waiting, won]);

	return (
		<div className="w-[800px] aspect-square relative mx-auto mb-6">
			{node()}
			<div className="flex justify-between p-2">
				<User.Username username={opponent} className="font-bold text-orange-600 hover:text-orange-500" />
				<User.Username username={username} className="font-bold text-orange-600 hover:text-orange-500" />
			</div>
		</div>
	);
};

export default RemoteDoom;

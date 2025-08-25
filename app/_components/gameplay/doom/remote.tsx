'use client';

import { useCallback, useEffect, useState } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { useAuth } from '@/app/_service/AuthContext';
import { ClientPlayer, EngageMessage, FlipMessage, InviteMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgChat, SvgDoom, SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import { Box, Grid } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import SafeImage from '../../mini/SafeImage';
import { Disconnected, Lost, Waiting, Won } from '../Cards';
import GameInfo from '../pong/Info';

const Diamond: React.FC<{ state: string; gid: string; index: number; sound: boolean }> = ({ state, gid, index, sound }) => {
	const { send } = useGameSocket();
	return (
		<Box
			className={`${
				state === 'B'
					? 'bg-gradient-to-b from-dark-900 to-dark-600'
					: state === 'D'
					? 'bg-gradient-to-b from-pink-900 to-orange-600'
					: 'bg-dark-500 hover:bg-dark-400 hover:border-b-8 hover:border-b-dark-400 transition-transform duration-100 hover:scale-105'
			} rounded-md cursor-pointer w-full aspect-square flex justify-center items-center`}
			onClick={() => {
				if (state === 'C') send(FlipMessage('card of doom', gid, index));
			}}
		>
			{state !== 'C' && (
				<SafeImage
					alt=""
					width={92}
					height={92}
					draggable={false}
					fallbackSrc="/Logo.png"
					src={state === 'B' ? '/Bomb.png' : '/Diamond.png'}
				/>
			)}
		</Box>
	);
};

const Doom: React.FC<{ sound: boolean; gid: string }> = ({ sound, gid }) => {
	const { doom } = useGameSocket();
	return (
		<Grid columns="5" rows="5" gap="2">
			{doom.cards.map((card, index) => (
				<Diamond key={index} state={card} index={index} sound={sound} gid={gid} />
			))}
		</Grid>
	);
};

const RemoteDoom: React.FC<{ gid: string; opponent: string }> = ({ gid, opponent }) => {
	const { username } = useAuth();
	const router = useRouter();
	const [sound, setSound] = useState<boolean>(true);
	const { pooler: getPooler, send, pong: game, open } = useGameSocket();

	const pooler: ClientPlayer | undefined = getPooler(opponent);

	useEffect(() => {
		if (open && gid) send(EngageMessage('card of doom', gid));
	}, [gid, open, send]);

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	function Content(): React.ReactNode {
		if (game.stop) return <Disconnected player={username} opponent={opponent} />;
		if (game.won)
			return (
				<Won player={username} opponent={opponent}>
					{pooler && (
						<>
							<PongButton
								onClick={() => send(InviteMessage('card of doom', pooler.username))}
								disabled={pooler.playerStatus === 'playing' || pooler.inviteStatus === 'pending'}
								loading={pooler.inviteStatus === 'pending'}
								className="w-full bg-dark-950 hover:bg-golden-500 hover:text-black text-sm"
							>
								<SvgDoom size={24} />
							</PongButton>
							<PongButton
								onClick={() => router.push(`/main/dashboard/chat?chatemate=${opponent}`)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								<SvgChat size={24} />
							</PongButton>
						</>
					)}
				</Won>
			);
		if (game.lost)
			return (
				<Lost player={username} opponent={opponent}>
					{pooler && (
						<>
							<PongButton
								onClick={() => send(InviteMessage('card of doom', pooler.username))}
								disabled={pooler.playerStatus === 'playing' || pooler.inviteStatus === 'pending'}
								loading={pooler.inviteStatus === 'pending'}
								className="w-full bg-dark-950 hover:bg-golden-500 hover:text-black text-sm"
							>
								Rematch
							</PongButton>
							<PongButton
								onClick={() => router.push(`/main/dashboard/chat?chatemate=${opponent}`)}
								className="bg-dark-700 w-full hover:bg-accent-300 hover:text-black"
							>
								<SvgChat size={24} />
							</PongButton>
						</>
					)}
				</Lost>
			);
		if (!game.start) return <Waiting player={username} opponent={opponent} />;
		return <Doom gid={gid} sound={sound} />;
	}

	return (
		<div>
			<div className="w-[700px] aspect-square bg-dark-950 relative mx-auto rounded-md shadow-xl mb-6">{Content()}</div>
			<div className="flex justify-center items-center gap-4">
				{sound ? (
					<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={switchSound}>
						<SvgSoundOff size={18} />
						Mute
					</PongButton>
				) : (
					<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={switchSound}>
						<SvgSoundOn size={18} /> Unmute
					</PongButton>
				)}
			</div>
			<GameInfo player={username} opponent={opponent} />
		</div>
	);
};

export default RemoteDoom;

'use client';

import { useEffect } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { useUser } from '@/app/_service/user/userContext';
import { ClientPlayer, DisconnectMessage, EngageMessage, FlipMessage, InviteMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgChat, SvgDoom } from '@/app/_svg/svg';
import { Box, Grid } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { User } from '../../dash/game/User';
import SafeImage from '../../mini/SafeImage';
import { Disconnected, Lost, Waiting, Won } from '../Cards';

const Diamond: React.FC<{ state: string; gid: string; index: number }> = ({ state, gid, index }) => {
	const { send } = useGameSocket();

	if (state === 'B')
		return (
			<Box className="rounded-xl w-full h-full border-[6px] border-cyan-300 bg-gradient-to-b from-teal-400 to-blue-700 flex justify-center items-center cursor-pointer animate-zoom-bounce">
				<SafeImage alt="" width={72} height={72} draggable={false} fallbackSrc="/Logo.png" src={'/Bomb.png'} />
			</Box>
		);
	else if (state === 'D')
		return (
			<Box className="rounded-xl w-full h-full border-[6px] border-orange-600 bg-gradient-to-b from-yellow-300 to-orange-600 flex justify-center items-center cursor-pointer">
				<SafeImage
					alt=""
					width={72}
					height={72}
					draggable={false}
					fallbackSrc="/Logo.png"
					src={'/Diamond.png'}
					className="animate-zoom-bounce"
				/>
			</Box>
		);
	return (
		<Box
			onClick={() => send(FlipMessage('card of doom', gid, index))}
			className="rounded-xl w-full h-full border-[6px] border-orange-600 text-orange-600 bg-dark-950 flex justify-center items-center cursor-pointer hover:scale-[115%] duration-200 animate-zoom-bounce"
		>
			<SvgDoom size={72}></SvgDoom>
		</Box>
	);
};

const Doom: React.FC<{ gid: string }> = ({ gid }) => {
	const { doom } = useGameSocket();
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
			<Grid
				columns="5"
				rows="5"
				gap="5"
				style={{ opacity: doom.won || doom.stop || doom.lost ? 0.5 : 1 }}
				className="bg-dark-950 rounded-md shadow-xl min-h-[700px]"
			>
				{doom.cards.map((card, index) => (
					<Diamond key={index} state={card} index={index} gid={gid} />
				))}
			</Grid>
		</>
	);
};

const RemoteDoom: React.FC<{ gid: string; opponent: string }> = ({ gid, opponent }) => {
	const { username } = useUser();
	const router = useRouter();
	const { pooler: getPooler, send, doom: game, open, reset } = useGameSocket();

	const pooler: ClientPlayer | undefined = getPooler(opponent);

	useEffect(() => {
		if (open && gid) send(EngageMessage('card of doom', gid));
	}, [gid, open, send]);

	useEffect(() => {
		reset();
		return () => {
			send(DisconnectMessage());
			reset();
		};
	}, [reset, send]);

	function Content(): React.ReactNode {
		return (
			<>
				<Doom gid={gid} />
				<div className="flex justify-between p-2">
					<User.Username username={opponent} className="font-bold text-orange-600 hover:text-orange-500" />
					<User.Username username={username} className="font-bold text-orange-600 hover:text-orange-500" />
				</div>
				<Box height="12px" />
				{!game.start && <Waiting player={username} opponent={opponent} />}
				{game.stop && <Disconnected player={username} opponent={opponent} />}
				{game.lost && (
					<Lost player={username} opponent={opponent}>
						{pooler && (
							<>
								<PongButton
									onClick={() => send(InviteMessage('card of doom', opponent))}
									disabled={
										pooler.playerStatus === 'playing' ||
										pooler.inviteStatus === 'pending' ||
										pooler.inviteStatus === 'declined'
									}
									loading={pooler.inviteStatus === 'pending'}
									className="bg-dark-700 w-full hover:bg-orange-600 hover:text-black duration-150 disabled:text-dark-400 disabled:bg-dark-700"
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
					</Lost>
				)}
				{game.won && (
					<Won player={username} opponent={opponent}>
						{pooler && (
							<>
								<PongButton
									onClick={() => send(InviteMessage('card of doom', opponent))}
									disabled={
										pooler.playerStatus === 'playing' ||
										pooler.inviteStatus === 'pending' ||
										pooler.inviteStatus === 'declined'
									}
									loading={pooler.inviteStatus === 'pending'}
									className="bg-dark-700 w-full hover:bg-orange-600 hover:text-black duration-150 disabled:text-dark-400 disabled:bg-dark-700"
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
				)}
			</>
		);
	}

	return (
		<div>
			<div className="w-[700px] aspect-square relative mx-auto mb-6">{Content()}</div>
		</div>
	);
};

export default RemoteDoom;

'use client';

import { useCallback, useEffect, useState } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { EngageMessage, FlipMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import { Box, Grid } from '@radix-ui/themes';
import SafeImage from '../../mini/SafeImage';
import { Disconnected, Won, Lost, Waiting } from '../Cards';
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
	// const cards: string[] = [
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'D',
	// 	'D',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'B',
	// 	'B',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// 	'C',
	// ];
	return (
		<Grid columns="5" rows="5" gap="2">
			{doom.cards.map((card, index) => (
				<Diamond key={index} state={card} index={index} sound={sound} gid={gid} />
			))}
		</Grid>
	);
};

const RemoteDoom: React.FC<{ gid: string }> = ({ gid }) => {
	const [sound, setSound] = useState<boolean>(true);
	const { send, doom: game, open } = useGameSocket();

	useEffect(() => {
		if (open && gid) send(EngageMessage('card of doom', gid));
	}, [gid, open, send]);

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	function Content(): React.ReactNode {
		if (game.stop) return <Disconnected player={'disconnedted'} opponent="tarikkudesu" />;
		if (game.won) return <Won player={'won'} opponent="tarikkudesu" />;
		if (game.lost) return <Lost player={'lost'} opponent="tarikkudesu" />;
		if (!game.start) return <Waiting player={'me'} opponent="tarikkudesu" />;
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
			<GameInfo player="tarikkudesu" opponent="klaus" />
		</div>
	);
};

export default RemoteDoom;

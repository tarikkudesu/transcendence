'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { useUser } from '@/app/_service/user/userContext';
import { HookMessage } from '@/app/_service/ws/game';
import { usePongSocket } from '@/app/_service/ws/game/pongContext';
import { SvgChat, SvgGameBoy, SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import { useRouter } from 'next/navigation';
import { User } from '../../dash/game/User';
import { Spinner } from '../../mini/Loading';
import { Disconnected, Lost, Waiting, Won } from '../Cards';
import Pong from './Pong';

const Ping: React.FC<{ sound: boolean }> = ({ sound }) => {
	const pong: Pong = useMemo(() => new Pong(), []);
	const { send, pong: game, gid } = usePongSocket();

	useEffect(() => {
		pong.updateSound(sound);
	}, [pong, sound]);

	const keyUp = useCallback(
		(e: KeyboardEvent) => {
			e.preventDefault();
			if (e.code === 'ArrowDown' || e.code === 'ArrowUp') send(HookMessage('pong', gid, false, false));
		},
		[gid, send]
	);

	const keyDown = useCallback(
		(e: KeyboardEvent) => {
			e.preventDefault();
			if (e.code === 'ArrowUp') send(HookMessage('pong', gid, true, false));
			else if (e.code === 'ArrowDown') send(HookMessage('pong', gid, false, true));
		},
		[gid, send]
	);

	const canvasCallback = useCallback(
		(canvas: HTMLCanvasElement | null) => {
			if (canvas) {
				const ctx = canvas.getContext('2d');
				canvas.focus();
				if (ctx) pong.setup(canvas, ctx, keyUp, keyDown);
				if (sound) {
					const audio = new Audio('/audio/arena-start.mp3');
					audio.play().catch(console.error);
				}
			} else {
				if (sound) {
					const audio = new Audio('/audio/arena-end.mp3');
					audio.play().catch(console.error);
				}
				pong.clear();
			}
		},
		[keyDown, keyUp, pong, sound]
	);

	if (!game) return null;

	pong.draw(game);

	return (
		<canvas
			width="800"
			height="600"
			tabIndex={0}
			ref={canvasCallback}
			className="block focus:outline-none"
			style={{ backgroundColor: 'transparent' }}
		></canvas>
	);
};

const RemotePong: React.FC<{ opponent: string }> = ({ opponent }) => {
	const router = useRouter();
	const { username } = useUser();
	const [sound, setSound] = useState<boolean>(true);
	const { won, lost, disconnected, waiting } = usePongSocket();

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	const node = useCallback(() => {
		if (won) return <Won player={username} opponent={opponent} />;
		if (lost) return <Lost player={username} opponent={opponent} />;
		if (waiting) return <Waiting player={username} opponent={opponent} />;
		if (disconnected) return <Disconnected player={username} opponent={opponent} />;
		return <Spinner />;
	}, [disconnected, lost, opponent, username, waiting, won]);

	return (
		<div>
			<div className="w-[812px] mx-auto flex justify-between mb-1">
				<User.Username username={opponent} className="font-bold" />
				<div className="text-dark-300">First to 7 wins</div>
				<User.Username username={username} className="font-bold" />
			</div>
			<div className="w-[812px] bg-dark-950 aspect-[4/3] relative overflow-hidden mx-auto rounded-md border-[6px] border-accent-300 shadow-xl mb-6">
				<Ping sound={sound} />
				{node()}
			</div>
			<div className="flex justify-center items-center gap-4">
				<PongButton
					onClick={() => router.push(`/main/dashboard/chat?chatemate=${opponent}`)}
					className="bg-accent-300 hover:bg-accent-200 text-black"
				>
					<SvgChat size={18} />
				</PongButton>
				<PongButton
					className="bg-accent-300 hover:bg-accent-200 text-black"
					onClick={() => router.push('/main/dashboard/playground')}
				>
					<SvgGameBoy size={18} />
				</PongButton>
				{sound ? (
					<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={switchSound}>
						<SvgSoundOff size={18} />
					</PongButton>
				) : (
					<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={switchSound}>
						<SvgSoundOn size={18} />
					</PongButton>
				)}
			</div>
		</div>
	);
};

export default RemotePong;

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { useUser } from '@/app/_service/user/userContext';
import { HookMessage } from '@/app/_service/ws/game';
import { usePongSocket } from '@/app/_service/ws/game/pongContext';
import { SvgChat, SvgGameBoy, SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import { useRouter } from 'next/navigation';
import { User } from '../../dash/game/User';
import { Disconnected, Lost, Nothing, Waiting, Won } from '../Cards';
import Pong from './Pong';

const Ping: React.FC<{ sound: boolean }> = ({ sound }) => {
	const { send, pong: game, gid } = usePongSocket();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong: Pong = useMemo(() => {
		return new Pong();
	}, []);

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

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		canvasRef.current?.focus();
		if (ctx) pong.setup(canvas, ctx, keyUp, keyDown);
		if (sound) {
			const audio = new Audio('/audio/arena-start.mp3');
			audio.play();
		}
		return () => {
			if (sound) {
				const audio = new Audio('/audio/arena-end.mp3');
				audio.play();
			}
			pong.clear();
		};
	}, [keyDown, keyUp, pong, sound, canvasRef]);

	if (!game) return null;

	pong.draw(game);

	return (
		<canvas
			width="800"
			height="600"
			tabIndex={0}
			ref={canvasRef}
			className="block focus:outline-none"
			style={{ backgroundColor: 'transparent' }}
		></canvas>
	);
};

const RemotePong: React.FC<{ opponent: string }> = ({ opponent }) => {
	const router = useRouter();
	const { username } = useUser();
	const [sound, setSound] = useState<boolean>(true);
	const { pong: game, open, won, lost, disconnected } = usePongSocket();

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	return (
		<div>
			<div className="w-[812px] mx-auto flex justify-between mb-1">
				<User.Username username={opponent} className="font-bold" />
				<div className="text-dark-300">First to 7 wins</div>
				<User.Username username={username} className="font-bold" />
			</div>
			<div className="w-[812px] bg-dark-950 aspect-[4/3] relative overflow-hidden mx-auto rounded-md border-[6px] border-accent-300 shadow-xl mb-6">
				{<Ping sound={sound} />}
				{!open && <Waiting player={username} opponent={opponent} />}
				{disconnected && <Disconnected player={username} opponent={opponent} />}
				{lost && <Lost player={username} opponent={opponent} />}
				{won && <Won player={username} opponent={opponent} />}
				{!game && <Nothing />}
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

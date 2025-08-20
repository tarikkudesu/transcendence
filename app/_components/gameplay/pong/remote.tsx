'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { EngageMessage, HookMessage, useGameSocket } from '@/app/_service/ws/game';
import { SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import { Disconnected, Lost, Waiting, Won } from '../Cards';
import GameInfo from './Info';
import Pong from './Pong';

const Ping: React.FC<{ sound: boolean; gid: string }> = ({ sound, gid }) => {
	const { send, pong: game } = useGameSocket();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong: Pong = useMemo(() => {
		return new Pong();
	}, []);

	useEffect(() => {
		pong.updateSound(sound);
	}, [sound]);

	pong.draw(game);

	const keyUp = useCallback((e: KeyboardEvent) => {
		e.preventDefault();
		if (e.code === 'ArrowDown' || e.code === 'ArrowUp') send(HookMessage('pong', gid, false, false));
	}, []);

	const keyDown = useCallback((e: KeyboardEvent) => {
		e.preventDefault();
		if (e.code === 'ArrowUp') send(HookMessage('pong', gid, true, false));
		else if (e.code === 'ArrowDown') send(HookMessage('pong', gid, false, true));
	}, []);

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
	}, []);

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

const RemotePong: React.FC<{ gid: string }> = ({ gid }) => {
	const [sound, setSound] = useState<boolean>(true);
	const { send, pong: game, open } = useGameSocket();

	useEffect(() => {
		if (open && gid) send(EngageMessage('pong', gid));
	}, [open]);

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	function Content(): React.ReactNode {
		if (game.stop) return <Disconnected player={'disconnedted'} opponent="tarikkudesu" />;
		if (game.won) return <Won player={'won'} opponent="tarikkudesu" />;
		if (game.lost) return <Lost player={'lost'} opponent="tarikkudesu" />;
		if (!game.start) return <Waiting player={'waiting'} opponent="tarikkudesu" />;
		return <Ping sound={sound} gid={gid} />;
	}

	return (
		<div>
			<div className="w-[812px] bg-dark-950 aspect-[4/3] relative overflow-hidden mx-auto rounded-md border-[6px] border-accent-300 shadow-xl mb-6">
				{Content()}
			</div>
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

export default RemotePong;

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GameInfo from '../local/ExtraInfo';

import { EngageMessage, HookMessage, useGameSocket } from '@/app/_service/ws/game';
import { SoudButtonOff, SoudButtonOn } from './Buttons';
import { Disconnected, Waiting } from './Cards';
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
		if (game.stop) return <Disconnected player={'disconnedted'} />;
		if (game.won) return <Disconnected player={'won'} />;
		if (game.lost) return <Disconnected player={'lost'} />;
		if (!game.start) return <Waiting player={'waiting'} />;
		return <Ping sound={sound} gid={gid} />;
	}

	return (
		<div>
			<div className="w-[812px] bg-dark-950 aspect-[4/3] relative overflow-hidden mx-auto rounded-md border-[6px] border-accent-300 shadow-xl mb-6">
				{Content()}
			</div>
			<div className="flex justify-center items-center gap-4">
				{sound ? <SoudButtonOn onClick={switchSound} /> : <SoudButtonOff onClick={switchSound} />}
			</div>
			<GameInfo />
		</div>
	);
};

export default RemotePong;

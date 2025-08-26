'use client';

import { PongButton } from '@/app/_components/buttons/ServerButtons';
import { SvgPause, SvgPlay, SvgReset, SvgSoundOff, SvgSoundOn } from '@/app/_svg/svg';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StartLocal, WonLocal } from '../Cards';
import GameInfo from './Info';
import Pong from './Pong';

const Ping: React.FC<{ updateWinner: (w: 'Player 1' | 'Player 2' | 'None') => void; pause: boolean; sound: boolean }> = ({
	updateWinner,
	pause,
	sound,
}) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pong: Pong = useMemo(() => {
		return new Pong();
	}, []);

	useEffect(() => {
		pong.pause(pause);
	}, [pause, pong]);

	useEffect(() => {
		pong.updateSound(sound);
	}, [pong, sound]);

	useEffect(() => {
		const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		canvasRef.current?.focus();
		if (ctx) {
			pong.setup(canvas, ctx, updateWinner);
			pong.resetMatch();
		}
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
	}, [pong, sound, updateWinner]);

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

const LocalPong: React.FC = ({}) => {
	const [sound, setSound] = useState<boolean>(true);
	const [pause, setPause] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const [winner, setWinner] = useState<'Player 1' | 'Player 2' | 'None'>('None');

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	const pauseGame = useCallback(() => {
		setPause((state) => !state);
	}, []);

	const startGame = useCallback(() => {
		setStart(true);
		setPause(false);
		setWinner('None');
	}, []);

	const resetGame = useCallback(() => {
		setWinner('None');
		setStart(false);
		setPause(false);
	}, []);

	const updateWinner = useCallback((w: 'Player 1' | 'Player 2' | 'None') => {
		setWinner(w);
		setStart(false);
	}, []);

	return (
		<div>
			<div className="w-[812px] bg-dark-950 aspect-[4/3] relative overflow-hidden mx-auto rounded-md border-[6px] border-golden-500 shadow-xl mb-6">
				{start && winner === 'None' && <Ping updateWinner={updateWinner} pause={pause} sound={sound} />}
				{start && pause && (
					<div className="absolute top-0 left-0 right-0 bottom-0 bg-golden-700/20 flex justify-center items-center flex-col text-xl">
						<SvgPlay size={80} className="text-golden-500 translate-x-1" />
					</div>
				)}
				{winner !== 'None' && <WonLocal winner={winner} />}
				{!start && winner === 'None' && <StartLocal />}
			</div>
			<div className="flex justify-center items-center gap-4">
				{!start ? (
					<PongButton className="text-black bg-golden-500 hover:bg-golden-400" onClick={startGame}>
						<SvgPlay size={18} />
						Start
					</PongButton>
				) : pause ? (
					<PongButton className="text-black bg-golden-500 hover:bg-golden-400" onClick={pauseGame}>
						<SvgPause size={18} />
						Pause
					</PongButton>
				) : (
					<PongButton className="text-black bg-golden-500 hover:bg-golden-400" onClick={pauseGame}>
						<SvgPlay size={18} /> Play
					</PongButton>
				)}
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
				<PongButton className="bg-dark-500 hover:bg-dark-400" onClick={resetGame}>
					<SvgReset size={18} /> Reset
				</PongButton>
			</div>
			<GameInfo />
		</div>
	);
};

export default LocalPong;

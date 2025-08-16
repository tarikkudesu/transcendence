'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PauseButton, PlayButton, ResetButton, SoudButtonOff, SoudButtonOn, StartButton } from './Buttons';
import GameInfo from './ExtraInfo';
import Pong from './Pong';
import WinnerCard from './Winner';

const LocalPong: React.FC = ({}) => {
	const [sound, setSound] = useState<boolean>(true);
	const [pause, setPause] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);
	const [winner, setWinner] = useState<'Player 1' | 'Player 2' | 'None'>('None');
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const pong: Pong = useMemo(() => {
		return new Pong();
	}, []);

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	const pauseGame = useCallback(() => {
		canvasRef.current?.focus();
		setPause((state) => !state);
	}, []);

	const startGame = useCallback(() => {
		setStart(true);
		const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		canvasRef.current?.focus();
		if (ctx) pong.setup(canvas, ctx, updateWinner);
	}, []);

	const resetGame = useCallback(() => {
		setWinner('None');
		setStart(false);
		pong.clear();
	}, []);

	useEffect(() => {
		pong.pause(pause);
	}, [pause]);

	useEffect(() => {
		return () => pong.clear();
	}, []);

	const updateWinner = useCallback((w: 'Player 1' | 'Player 2' | 'None') => {
		if (w === 'None') return;
		setWinner(w);
		setStart(false);
		pong.reset();
		pong.clear();
	}, []);

	return (
		<div>
			<div
				className="w-[800px] bg-black aspect-[4/3] relative overflow-hidden mx-auto rounded-md border border-dark-600 shadow-2xl mb-4"
				onClick={pauseGame}
			>
				<canvas
					width="800"
					height="600"
					tabIndex={0}
					ref={canvasRef}
					className="block focus:outline-none"
					style={{ backgroundColor: 'transparent' }}
				></canvas>
				{start && pause && (
					<div className="absolute top-0 left-0 right-0 bottom-0 bg-dark-500/50 flex justify-center items-center flex-col text-xl">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 640 640"
							height={80}
							width={80}
							className="text-accent-300 translate-x-1"
						>
							<path
								fill="currentColor"
								d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
							/>
						</svg>
					</div>
				)}
				{winner === 'Player 1' && <WinnerCard winner={winner} accent="accent-300" />}
				{winner === 'Player 2' && <WinnerCard winner={winner} accent="accent-300" />}
			</div>
			<div className="flex justify-center items-center gap-4">
				{!start ? (
					<StartButton onClick={startGame} />
				) : pause ? (
					<PlayButton onClick={pauseGame} />
				) : (
					<PauseButton onClick={pauseGame} />
				)}
				{sound ? <SoudButtonOn onClick={switchSound} /> : <SoudButtonOff onClick={switchSound} />}
				<ResetButton onClick={resetGame} />
			</div>
			<GameInfo />
		</div>
	);
};

export default LocalPong;

// <div
// className="w-[15px] h-[80px] bg-accent-300 absolute top-1/2 left-0 -translate-y-1/2"
// style={{
// 	width: consts.PaddleRadius * 2,
// 	height: consts.PaddleHeight,
// 	top: pong.client.leftPaddlePosY - consts.PaddleHeight / 2,
// 	left: pong.client.leftPaddlePosX - consts.PaddleRadius,
// }}
// ></div>
// <div
// className="w-[15px] h-[80px] bg-accent-300 absolute top-1/2 right-0 -translate-y-1/2"
// style={{
// 	width: consts.PaddleRadius * 2,
// 	height: consts.PaddleHeight,
// 	top: pong.client.rightPaddlePosY - consts.PaddleHeight / 2,
// 	left: pong.client.rightPaddlePosX - consts.PaddleRadius,
// }}
// ></div>
// <div
// className="w-[20px] h-[20px] bg-accent-300 absolute top-1/3 right-1/4"
// style={{
// 	width: consts.BallRadius * 2,
// 	height: consts.BallRadius * 2,
// 	top: pong.client.ballY - consts.BallRadius,
// 	left: pong.client.ballX - consts.BallRadius,
// }}
// ></div>

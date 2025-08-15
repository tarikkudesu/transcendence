'use client';
import * as consts from './consts';
import React, { useCallback, useEffect, useState } from 'react';
import { PauseButton, PlayButton, ResetButton, SoudButtonOff, SoudButtonOn, StartButton } from './Buttons';
import GameInfo from './ExtraInfo';
import pong from './Pong';

const LocalPong: React.FC = ({}) => {
	const [sound, setSound] = useState<boolean>(true);
	const [pause, setPause] = useState<boolean>(false);
	const [start, setStart] = useState<boolean>(false);

	const switchSound = useCallback(() => {
		setSound((state) => !state);
	}, []);

	const pauseGame = useCallback(() => {
		setPause((state) => !state);
	}, []);

	const startGame = useCallback(() => {
		setStart((state) => !state);
		pong.setup();
	}, []);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			if (pause) {
				pong.sound = 0;
				pong.updateObjects();
			}
		}, 1000 / 60);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<div>
			<div className="max-w-[800px] bg-black aspect-[4/3] relative overflow-hidden mx-auto rounded-md border border-dark-600 shadow-2xl mb-4">
				<span className="font-mono text-white text-[60px] absolute top-12 left-[30%] -translate-y-1/2">0</span>
				<span className="font-mono text-white text-[60px] absolute top-12 right-[30%] -translate-y-1/2">0</span>
				<div
					className="w-[15px] h-[80px] bg-accent-300 absolute top-1/2 left-0 -translate-y-1/2"
					style={{
						width: consts.PaddleRadius * 2,
						height: consts.PaddleHeight,
						top: pong.leftPaddlePosY - pong.paddleHeight / 2,
						left: pong.leftPaddlePosX - pong.paddleRadius,
					}}
				></div>
				<div className="w-[15px] h-[80px] bg-accent-300 absolute top-1/2 right-0 -translate-y-1/2"></div>
				<div className="w-[20px] h-[20px] bg-accent-300 absolute top-1/3 right-1/4"></div>
				<div className="h-full w-[0px] border-2 border-dashed border-accent-700 absolute top-0 left-1/2 -translate-x-1/2"></div>
				<div className="h-[100px] w-[100px] border-4 border-dashed rounded-full border-accent-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
				{pause && (
					<div className="absolute top-0 left-0 right-0 bottom-0 bg-dark-500/50 flex justify-center items-center flex-col text-xl">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height={80} width={80} className="text-accent-300">
							<path
								fill="currentColor"
								d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z"
							/>
						</svg>
						Game Paused
					</div>
				)}
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
				<ResetButton onClick={() => true} />
			</div>
			<GameInfo />
		</div>
	);
};

export default LocalPong;

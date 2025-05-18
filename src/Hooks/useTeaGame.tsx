import { useContext, useState } from "react";
import { SocketConnectionContext } from "./useTeaWebsocket";
import { Frame, Score, WS } from "./ws-client";

export function useTeaGame() {
	const { data, send } = useContext(SocketConnectionContext);
	const [playing, setPlaying] = useState<boolean>(false);
	const [frame, setFrame] = useState<Frame>(Frame.instance);
	const [score, setScore] = useState<Score | null>(null);
	const [won, setWon] = useState<boolean>(false);
	const [lost, setLost] = useState<boolean>(false);
	const [draw, setDraw] = useState<boolean>(false);

	switch (data) {
		case 'START':
			console.log('Game started');
			setPlaying(true);
			break;
		case 'STOP': {
			console.log('Game stopped');
			setPlaying(false);
			break;
		}
		case 'FRAME': {
			console.log('Game frame');
			const parsedFrame: Frame = WS.Json({ message: data, target: Frame.instance }) as Frame;
			setFrame(parsedFrame);
			break;
		}
		case 'SCORE': {
			console.log('Game score');
			const parsedScore: Score = WS.Json({ message: data, target: Score.instance }) as Score;
			setScore(parsedScore);
			setPlaying(false);
			break;
		}
		case 'WON': {
			console.log('Game won');
			setPlaying(false);
			setWon(true);
			break;
		}
		case 'LOST':
			console.log('Game lost');
			setPlaying(false);
			setLost(true);
			break;
		case 'DRAW':
			console.log('Game draw');
			setPlaying(false);
			setDraw(true);
			break;
		default:
			console.log('Unknown game state');
			break;
	}
	return {
		playing,
		frame,
		score,
		won,
		lost,
		draw,
		send,
	};
}

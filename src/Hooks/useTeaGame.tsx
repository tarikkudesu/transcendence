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
			setPlaying(true);
			break;
		case 'STOP': {
			setPlaying(false);
			break;
		}
		case 'FRAME': {
			const parsedFrame: Frame = WS.Json({ message: data, target: Frame.instance }) as Frame;
			setFrame(parsedFrame);
			break;
		}
		case 'SCORE': {
			const parsedScore: Score = WS.Json({ message: data, target: Score.instance }) as Score;
			setScore(parsedScore);
			setPlaying(false);
			break;
		}
		case 'WON': {
			setPlaying(false);
			setWon(true);
			break;
		}
		case 'LOST':
			setPlaying(false);
			setLost(true);
			break;
		case 'DRAW':
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

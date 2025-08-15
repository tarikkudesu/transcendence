import _ from 'lodash';
import * as Main from './index';

interface JsonProps {
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	target: any;
}

// ? Comminication Helpers
export function Json({ message, target }: JsonProps) {
	const json = JSON.parse(message);
	const properties = Object.getOwnPropertyNames(json);
	Object.getOwnPropertyNames(target).forEach((property) => {
		if (_.includes(properties, property) === false) throw new Error('Invalid JSON ' + message + JSON.stringify(target));
	});
	return json;
}

export function rescaleFrame(f: Main.ClientPong, width: number, height: number): Main.ClientPong {
	const scaleX = width / 1024;
	const scaleY = height / 768;
	const scaleRadius = Math.min(scaleX, scaleY);

	return {
		...f,
		ballX: Math.ceil(f.ballX * scaleX),
		ballY: Math.ceil(f.ballY * scaleY),
		ballRadius: Math.ceil(f.ballRadius * scaleRadius),
		paddleRadius: Math.ceil(f.paddleRadius * scaleRadius),
		paddleHeight: Math.ceil(f.paddleHeight * scaleY),
		leftPaddlePosX: Math.ceil(f.leftPaddlePosX * scaleX),
		leftPaddlePosY: Math.ceil(f.leftPaddlePosY * scaleY),
		rightPaddlePosX: Math.ceil(f.rightPaddlePosX * scaleX),
		rightPaddlePosY: Math.ceil(f.rightPaddlePosY * scaleY),
	};
}

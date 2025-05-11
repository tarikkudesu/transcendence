import React, { useEffect, useState } from 'react';
import { Card, Heading } from '@radix-ui/themes';
import { Canvas } from './Canvas';
import { WS, Frame, Message } from '../protocole/ws-client.js';

interface GameProps {
	data: string;
	send: (message: string) => void;
}

export const Game: React.FC<GameProps> = ({ data, send }) => {
	const [frame, setFrame] = useState<Frame>(Frame.instance);

	useEffect(() => {
		if (data === '') return;
		try {
			const json: Message = WS.Json({ message: data, target: Message.instance });
			if (json.message === 'frame') {
				const f: Frame = WS.Json({ message: json.data, target: Frame.instance });
				setFrame(f);
			} else if (json.message === 'error') {
				throw new Error('Invalid message');
			}
		} catch (err: any) {
			console.error(err.message);
		}
	}, [data]);

	return (
		<Card className="div10">
			<Heading align="center" size="3">
				Game
			</Heading>
			<Canvas width={800} height={600} frame={frame} />
		</Card>
	);
};

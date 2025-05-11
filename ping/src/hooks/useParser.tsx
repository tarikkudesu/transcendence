import { useState, useEffect } from 'react';
import { WS, Message } from '../protocole/ws-client.js';

export function useParser(data: string) {
	const [game, setGame] = useState<string>('');
	const [chat, setChat] = useState<string>('');
	const [pool, setPool] = useState<string>('');
	const [tournement, setTournement] = useState<string>('');
	const [invitations, setInvitations] = useState<string>('');
	const [playing, setPlaying] = useState<boolean>(false);

	useEffect(() => {
		if (data === '') return;
		try {
			const { message } = WS.Json({ message: data, target: Message.instance });
			// * frame, start, stop, pool, score, won, lost, invitations, error
			if (message === 'start') {
				setPlaying(true);
			} else if (message === 'stop') {
				setPlaying(true);
			} else if (message === 'pool') {
				setPool(message);
			} else if (message === 'score') {
				setGame(message);
			} else if (message === 'won') {
				setPlaying(true);
				setGame(message);
			} else if (message === 'lost') {
				setPlaying(true);
				setGame(message);
			} else if (message === 'invitations') {
				setInvitations(message);
			} else if (message === 'error') {
				throw new Error('Invalid message');
			}
		} catch (err: any) {
			console.error(err.message);
		}
	}, [data]);
	return { game, chat, pool, invitations, tournement, playing };
}

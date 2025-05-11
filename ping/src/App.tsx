import { Box, Button } from '@radix-ui/themes';

import { useNotification } from './hooks/useNotification';
import { useWebsocket } from './hooks/useWebSocket';
import { useParser } from './hooks/useParser';

import { WS } from './protocole/ws-client';

import { Invitations } from './Components/Invitations';
import { Tournement } from './Components/Tournement';
import { Pool } from './Components/Pool';
import { Chat } from './Components/Chat';
import { Game } from './Components/Game';

import { faker } from '@faker-js/faker';
import { useState } from 'react';

function App() {
	const [username, setUsername] = useState<string>(faker.internet.username());
	const { data, send, error, close, open } = useWebsocket({ url: 'ws://localhost:3000/api/game/', username });
	const { game, chat, pool, invitations, tournement, playing } = useParser(data);
	const { notify } = useNotification();

	if (error) notify({ message: 'Could not connect', error });
	if (close) notify({ message: 'Connection lost', error: true });

	return (
		<>
			<Button
				disabled={!open}
				onClick={() => {
					const m: string = WS.ConnectMessage(username);
					send(m);
				}}
			>
				Send
			</Button>
			<Box className="parent">
				<Chat data={chat} send={send} />
				<Pool data={pool} send={send} />
				<Game data={game} send={send} />
				<Tournement data={tournement} send={send} />
				<Invitations data={invitations} send={send} />
			</Box>
		</>
	);
}

export default App;

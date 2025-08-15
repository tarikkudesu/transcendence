import { createContext, useContext } from 'react';
import { Message, OuterMessage } from './schemas';

class SocketState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;

	panel: OuterMessage[] = [];
	conversation: Message[] = [];

	send: (message: string) => void = () => {};
}

export const chatContext = createContext(new SocketState());

export function useChatSocket() {
	return useContext(chatContext);
}

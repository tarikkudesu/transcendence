import { createContext, useContext } from 'react';
import { Message, OuterMessage } from './schemas';

class SocketState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;

	lastMessage: (u: string) => Message | undefined = (u: string) => undefined;
	panel: OuterMessage[] = [];
}

export const chatContext = createContext(new SocketState());

export function useChatSocket() {
	return useContext(chatContext);
}

import { createContext, useContext } from 'react';
import { OuterMessage } from './schemas';

class SocketState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;

	panel: OuterMessage[] = [];
}

export const chatContext = createContext(new SocketState());

export function useChatSocket() {
	return useContext(chatContext);
}

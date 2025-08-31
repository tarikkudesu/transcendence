import { createContext, useContext } from 'react';
import * as Main from './index';

class SocketState {
	gid: string = '';
	won: boolean = false;
	lost: boolean = false;
	waiting: boolean = false;
	nothing: boolean = false;
	disconnected: boolean = false;
	pong: Main.ClientPong | null = null;
	send: (message: string) => void = () => {};
}

export const pongContext = createContext(new SocketState());

export function usePongSocket() {
	return useContext(pongContext);
}

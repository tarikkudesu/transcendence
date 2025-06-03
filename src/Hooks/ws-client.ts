import _ from 'lodash';

// import { AvatarGenerator } from 'random-avatar-generator'; // ! ------------------------------------ remove
import { createContext } from 'react';
// const generator = new AvatarGenerator(); // ! ------------------------------------------------------ remove

// ! shared -----------------------------------------------------------------------------

interface MessageProps {
	username: string;
	message: string;
	hash: string;
	game: 'pong' | 'card of doom';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}
export class Message {
	public username: string;
	public message: string;
	public hash: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public data: any;
	public game: 'pong' | 'card of doom';
	constructor({ username, hash, message, data, game }: MessageProps) {
		this.data = JSON.stringify(data);
		this.username = username;
		this.message = message;
		this.hash = hash;
		this.game = game;
	}
	static instance = new Message({ username: '', hash: '', message: '', data: {}, game: 'pong' });
}

export class WSError {
	public message: string;
	constructor(error: string) {
		this.message = error;
	}
	static instance = new WSError('');
}

export class ClientPlayer {
	public username: string;
	public game: 'pong' | 'card of doom';
	public invite_status: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(username: string, game: 'pong' | 'card of doom', invite_status: 'unsent' | 'pending' | 'accepted' | 'declined') {
		this.invite_status = invite_status;
		this.username = username;
		this.game = game;
	}
	static instance = new ClientPlayer('', 'pong', 'unsent');
}

export class ClientInvitation {
	public sender: string;
	public game: 'pong' | 'card of doom';
	public invite_status: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(sender: string, game: 'pong' | 'card of doom', invite_status: 'unsent' | 'pending' | 'accepted' | 'declined') {
		this.invite_status = invite_status;
		this.sender = sender;
		this.game = game;
	}
	static instance = new ClientInvitation('', 'pong', 'unsent');
}

// ! res --------------------------------------------------------------------------------

// * Pool

export class Engage {
	gid: string;
	constructor(gid: string) {
		this.gid = gid;
	}
	public static instance = new Engage('');
}

export class Invite {
	recipient: string;
	constructor(recipient: string) {
		this.recipient = recipient;
	}
	public static instance = new Invite('');
}

// * Game
export class Hook {
	gid: string;
	up: boolean;
	down: boolean;
	constructor(gid: string, up: boolean, down: boolean) {
		this.up = up;
		this.gid = gid;
		this.down = down;
	}
	public static instance = new Hook('', false, false);
}

export class Flip {
	gid: string;
	pos: number;
	constructor(gid: string, pos: number) {
		this.gid = gid;
		this.pos = pos;
	}
	public static instance = new Flip('', 0);
}

// ! req --------------------------------------------------------------------------------

// * Pool

export class Play {
	public gid: string;
	constructor(gid: string) {
		this.gid = gid;
	}
	static instance = new Play('');
}

export class Hash {
	username: string = '';
	hash: string = '';
	constructor() {}
	static instance = new Hash();
}

export class Pool {
	public pool: ClientPlayer[];
	constructor(pool: ClientPlayer[]) {
		this.pool = pool;
	}
	static instance = new Pool([]);
}

export class Invitations {
	public invitations: ClientInvitation[];
	constructor(invitations: ClientInvitation[]) {
		this.invitations = invitations;
	}
	static instance = new Invitations([]);
}

// * Game

export class ClientPong {
	public playerScore: number = 0;
	public opponentScore: number = 0;
	public start: boolean = false;
	public stop: boolean = false;
	public lost: boolean = false;
	public won: boolean = false;
	public ballX: number = 0;
	public ballY: number = 0;
	public ballRadius: number = 0;
	public paddleRadius: number = 0;
	public paddleHeight: number = 0;
	public leftPaddlePosX: number = 0;
	public leftPaddlePosY: number = 0;
	public rightPaddlePosX: number = 0;
	public rightPaddlePosY: number = 0;
	constructor() {}
	public static instance = new ClientPong();
}

export class ClientCardOfDoom {
	public cards: string[] = [];
	public playerScore: number = 0;
	public opponentScore: number = 0;
	public start: boolean = false;
	public stop: boolean = false;
	public lost: boolean = false;
	public won: boolean = false;
	constructor() {}
	public static instance = new ClientCardOfDoom();
}

// ! Protocole ------------------------------------------------------------

interface JsonProps {
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	target: any;
}

export class WSC {
	private static instance: WSC | null;
	public static username: string = '';
	// public static img: string = generator.generateRandomAvatar(WSC.username);
	constructor() {
		if (WSC.instance) return WSC.instance;
		WSC.instance = this;
	}

	// * connect, invite, play, hook

	// ? Comminication Helpers
	Json({ message, target }: JsonProps) {
		const json = JSON.parse(message);
		const properties = Object.getOwnPropertyNames(json);
		Object.getOwnPropertyNames(target).forEach((property) => {
			if (_.includes(properties, property) === false) throw new Error('Invalid JSON ' + message + JSON.stringify(target));
		});
		return json;
	}

	// ? Protocole Message Builders
	ErrorMessage(error: string) {
		return JSON.stringify(new Message({ username: '', hash: '', message: 'ERROR', game: 'pong', data: new WSError(error) }));
	}

	ConnectMessage(username: string, hash: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'CONNECT', game: 'pong', data: {} }));
	}
	EngageMessage(username: string, hash: string, game: 'pong' | 'card of doom', gid: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'ENGAGE', game, data: new Engage(gid) }));
	}
	InviteMessage(username: string, hash: string, game: 'pong' | 'card of doom', recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'INVITE', game, data: new Invite(recipient) }));
	}
	AcceptMessage(username: string, hash: string, game: 'pong' | 'card of doom', recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'ACCEPT', game, data: new Invite(recipient) }));
	}
	RejectMessage(username: string, hash: string, game: 'pong' | 'card of doom', recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'REJECT', game, data: new Invite(recipient) }));
	}
	DeleteMessage(username: string, hash: string, game: 'pong' | 'card of doom', recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'DELETE', game, data: new Invite(recipient) }));
	}

	HookMessage(username: string, hash: string, game: 'pong' | 'card of doom', gid: string, up: boolean, down: boolean): string {
		return JSON.stringify(new Message({ username, hash, message: 'HOOK', game, data: new Hook(gid, up, down) }));
	}
	FlipMessage(username: string, hash: string, game: 'pong' | 'card of doom', gid: string, pos: number): string {
		return JSON.stringify(new Message({ username, hash, message: 'FLIP', game, data: new Flip(gid, pos) }));
	}
}

export const WS = new WSC();

export const { ErrorMessage, ConnectMessage, InviteMessage, AcceptMessage, RejectMessage, DeleteMessage, HookMessage, EngageMessage } = WS;

class initialState {
	// * Websocket vars
	error: boolean = false;
	close: boolean = false;
	open: boolean = false;
	data: string = '';

	// * Incoming data
	hash: string = '';
	pool: ClientPlayer[] = [];
	invitations: ClientInvitation[] = [];

	pong: ClientPong = ClientPong.instance;
	doom: ClientCardOfDoom = ClientCardOfDoom.instance;

	send: (message: string) => void = () => {};
	reset: () => void = () => {};
}

export const wsContext = createContext(new initialState());

export function rescaleFrame(f: ClientPong, width: number, height: number): ClientPong {
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

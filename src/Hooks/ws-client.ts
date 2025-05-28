import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { AvatarGenerator } from 'random-avatar-generator'; // ! ------------------------------------ remove
import { createContext } from 'react';
const generator = new AvatarGenerator(); // ! ------------------------------------------------------ remove

// ! shared -----------------------------------------------------------------------------

interface MessageProps {
	username: string;
	message: string;
	hash: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any;
}
export class Message {
	public username: string;
	public message: string;
	public hash: string;
	public data: string;
	constructor({ username, hash, message, data }: MessageProps) {
		this.data = JSON.stringify(data);
		this.username = username;
		this.message = message;
		this.hash = hash;
	}
	static instance = new Message({ username: '', hash: '', message: '', data: {} });
}

export class WSError {
	public message: string;
	constructor(error: string) {
		this.message = error;
	}
	static instance = new WSError('');
}

export class ClientPlayer {
	public img: string;
	public username: string;
	public invite_status: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(username: string, img: string, invite_status: 'unsent' | 'pending' | 'accepted' | 'declined') {
		this.invite_status = invite_status;
		this.username = username;
		this.img = img;
	}
	static instance = new ClientPlayer('', '', 'unsent');
}
export class ClientInvitation {
	public img: string;
	public sender: string;
	public invite_status: 'unsent' | 'pending' | 'accepted' | 'declined';
	constructor(sender: string, img: string, invite_status: 'unsent' | 'pending' | 'accepted' | 'declined') {
		this.invite_status = invite_status;
		this.sender = sender;
		this.img = img;
	}
	static instance = new ClientInvitation('', '', 'unsent');
}

// ! res --------------------------------------------------------------------------------

// * Pool
export class Connect {
	img: string;
	page: string;
	query: string;
	constructor(img: string, page: string, query: string) {
		this.query = query;
		this.page = page;
		this.img = img;
	}
	public static instance = new Connect('', '', '');
}

export class Disconnect {
	page: string;
	constructor(page: string) {
		this.page = page;
	}
	public static instance = new Disconnect('');
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
	up: boolean;
	down: boolean;
	constructor(up: boolean, down: boolean) {
		this.up = up;
		this.down = down;
	}
	public static instance = new Hook(false, false);
}

// ! req --------------------------------------------------------------------------------

// * Pool

export class Play {
	public game: string;
	constructor(game: string) {
		this.game = game;
	}
	static instance = new Play('');
}

export class Hash {
	username: string = '';
	hash: string = '';
	img: string = '';
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
export class Start {
	public start: string;
	constructor() {
		this.start = 'start';
	}
	public static instance = new Start();
}

export class Stop {
	public stop: string;
	constructor() {
		this.stop = 'stop';
	}
	public static instance = new Stop();
}

export class Frame {
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
	static instance = new Frame();
}

export class Score {
	public player: number;
	public opponent: number;
	constructor(player: number, opponent: number) {
		this.player = player;
		this.opponent = opponent;
	}
	static instance = new Score(0, 0);
}

export class Won {
	public won: string;
	constructor() {
		this.won = 'won';
	}
	static instance = new Won();
}

export class Lost {
	public lost: string;
	constructor() {
		this.lost = 'lost';
	}
	static instance = new Lost();
}

// ! Protocole ------------------------------------------------------------

interface JsonProps {
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	target: any;
}

export class WSC {
	private static instance: WSC | null;
	public static username: string = faker.internet.username();
	public static img: string = generator.generateRandomAvatar(WSC.username);
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
			if (_.includes(properties, property) === false) throw new Error('Invalid JSON');
		});
		return json;
	}

	// ? Protocole Message Builders
	ErrorMessage(username: string, hash: string, error: string) {
		return JSON.stringify(new Message({ username, hash, message: 'ERROR', data: new WSError(error) }));
	}

	ConnectMessage(username: string, hash: string, img: string, page: string, query: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'CONNECT', data: new Connect(img, page, query) }));
	}
	DisonnectMessage(username: string, hash: string, page: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'DISCONNECT', data: new Disconnect(page) }));
	}
	InviteMessage(username: string, hash: string, recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'INVITE', data: new Invite(recipient) }));
	}
	AcceptMessage(username: string, hash: string, recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'ACCEPT', data: new Invite(recipient) }));
	}
	RejectMessage(username: string, hash: string, recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'REJECT', data: new Invite(recipient) }));
	}
	DeleteMessage(username: string, hash: string, recipient: string): string {
		return JSON.stringify(new Message({ username, hash, message: 'DELETE', data: new Invite(recipient) }));
	}

	HookMessage(username: string, hash: string, up: boolean, down: boolean): string {
		return JSON.stringify(new Message({ username, hash, message: 'HOOK', data: new Hook(up, down) }));
	}
}

export const WS = new WSC();

export const { ErrorMessage, ConnectMessage, InviteMessage, AcceptMessage, RejectMessage, DeleteMessage, HookMessage, DisonnectMessage } = WS;

export function rescaleFrame(f: Frame, width: number, height: number): Frame {
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

	score: number[] = [0, 0];
	frame: Frame = new Frame();
	lost: boolean = false;
	won: boolean = false;

	send: (message: string) => void = () => {};
	reset: () => void = () => {};
}

export const wsContext = createContext(new initialState());

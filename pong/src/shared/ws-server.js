import { Ball, Vector, Paddle } from './game/index.js';

import _ from 'lodash';

// ! shared ------------------------------------------------------------------------------------------
export class Message {
	constructor({ event, object }) {
		this.message = event;
		this.data = JSON.stringify(object);
	}
	static instance = new Message({ event: '', object: {} });
}

export class User {
	constructor(username, email) {
		this.username = username;
		this.email = email;
	}
	static instance = new User('', '');
}

export class WSError {
	constructor(error) {
		this.message = error;
	}
	static instance = new WSError('');
}

// ! res ------------------------------------------------------------------------------------------

export class Frame {
	ballX;
	ballY;
	ballRadius;
	paddleRadius;
	leftPaddleTopX;
	leftPaddleTopY;
	rightPaddleTopX;
	rightPaddleTopY;
	leftPaddleBottomX;
	leftPaddleBottomY;
	rightPaddleBottomX;
	rightPaddleBottomY;
	constructor(ball, rightPaddle, leftPaddle) {
		this.ballRadius = Math.ceil(ball.radius);
		this.paddleRadius = Math.ceil(rightPaddle.radius);
		this.ballX = Math.ceil(ball.pos.x);
		this.ballY = Math.ceil(ball.pos.y);
		this.rightPaddleTopX = Math.ceil(rightPaddle.start.x);
		this.rightPaddleTopY = Math.ceil(rightPaddle.start.y);
		this.rightPaddleBottomX = Math.ceil(rightPaddle.end.x);
		this.rightPaddleBottomY = Math.ceil(rightPaddle.end.y);
		this.leftPaddleTopX = Math.ceil(leftPaddle.start.x);
		this.leftPaddleTopY = Math.ceil(leftPaddle.start.y);
		this.leftPaddleBottomX = Math.ceil(leftPaddle.end.x);
		this.leftPaddleBottomY = Math.ceil(leftPaddle.end.y);
	}
	static instance = new Frame(
		new Ball({ pos: new Vector(0, 0), radius: 0, velocity: new Vector(0, 0) }),
		new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) }),
		new Paddle({ start: new Vector(0, 0), end: new Vector(0, 0), radius: 0, constrains: new Vector(0, 0) })
	);
}

export class Invitations {
	constructor(invitations) {
		this.invitations = invitations;
	}
	static instance = new Invitations([]);
}

export class Lost {
	constructor() {
		this.lost = 'lost';
	}
	static instance = new Lost();
}

export class Pooler {
	constructor(username, profile) {
		this.username = username;
		this.profile = profile;
	}
	static instance = new Pooler('', '');
}

export class Pool {
	constructor(pool) {
		this.pool = pool;
	}
	static instance = new Pool([]);
}

export class Score {
	constructor(player, opponent) {
		this.player = player;
		this.opponent = opponent;
	}
	static instance = new Score(0, 0);
}

export class Start {
	constructor() {
		this.start = 'start';
	}
	static instance = new Start();
}

export class Stop {
	constructor() {
		this.stop = 'stop';
	}
	static instance = new Stop();
}

export class Won {
	constructor() {
		this.won = 'won';
	}
	static instance = new Won();
}

// ! req -------------------------------------------------------------------------

export class Connect {
	// TODO: initial game data can be added here
	constructor(username) {
		this.username = username;
	}
	static instance = new Connect('');
}

export class Hook {
	constructor(up, down) {
		this.up = up;
		this.down = down;
	}
	static instance = new Hook(false, false);
}

export class Invite {
	constructor(from, to) {
		this.from = from;
		this.to = to;
	}
	static instance = new Invite('', '');
}

export class Play {
	constructor(username, opponent) {
		this.username = username;
		this.opponent = opponent;
	}
	static instance = new Play('', '');
}

// ! Protocole ------------------------------------------------------------------------------

class WSS {
	static #insance;

	constructor() {
		if (WSS.#insance) return WSS.#insance;
		WSS.#insance = this;
	}

	// * frame, start, stop, pool, score, won, lost, invitations, error

	// ? Comminication Helpers
	Json({ message, target }) {
		const json = JSON.parse(message);
		const properties = Object.getOwnPropertyNames(json);
		const targetProperties = Object.getOwnPropertyNames(target);
		targetProperties.forEach((property) => {
			if (_.includes(properties, property) === false) throw new Error('Invalid JSON');
		});
		return json;
	}

	// ? Protocole Message Builders
	FrameMessage(ball, rightPaddle, leftPaddle) {
		return JSON.stringify(new Message({ event: 'frame', object: new Frame(ball, rightPaddle, leftPaddle) }));
	}
	StartMessage() {
		return JSON.stringify(new Message({ event: 'start', object: new Start() }));
	}
	StopMessage() {
		return JSON.stringify(new Message({ event: 'stop', object: new Stop() }));
	}
	PoolMessage(getPoolers) {
		return JSON.stringify(new Message({ event: 'pool', object: new Pool(getPoolers()) }));
	}
	InvitationMessage(getInvitions) {
		return JSON.stringify(new Message({ event: 'invitations', object: new Invitations(getInvitions()) }));
	}
	WonMessage() {
		return JSON.stringify(new Message({ event: 'won', object: new Won() }));
	}
	LostMessage() {
		return JSON.stringify(new Message({ event: 'lost', object: new Lost() }));
	}
	ScoreMessage(player, opponent) {
		return JSON.stringify(new Message({ event: 'score', object: new Score(player, opponent) }));
	}
	ErrorMessage(error) {
		return JSON.stringify(new Message({ event: 'error', object: new WSError(error) }));
	}
}

export const WS = new WSS();

import * as Main from '../index.js';

export class Message {
	constructor({ message, data, game }) {
		this.data = JSON.stringify(data);
		this.message = message;
		this.game = game;
	}
}
Message.instance = new Message({ message: '', data: {}, game: 'pong' });
export class WSError {
	constructor(error) {
		this.message = error;
	}
}
WSError.instance = new WSError('');
export class ClientPlayer {
	constructor(username, game, playerStatus, inviteStatus) {
		this.inviteStatus = inviteStatus;
		this.playerStatus = playerStatus;
		this.username = username;
		this.game = game;
	}
}
ClientPlayer.instance = new ClientPlayer('', 'pong', 'free', 'unsent');
export class ClientInvitation {
	constructor(sender, game, inviteStatus) {
		this.inviteStatus = inviteStatus;
		this.sender = sender;
		this.game = game;
	}
}
ClientInvitation.instance = new ClientInvitation('', 'pong', 'unsent');
export class ClientTournament {
	constructor({ name, date, emptySlots, state, results, registered, nextMatches, round, gid, restriction }) {
		this.restriction = restriction;
		this.nextMatches = nextMatches;
		this.registered = registered;
		this.emptySlots = emptySlots;
		this.results = results;
		this.state = state;
		this.round = round;
		this.date = date;
		this.name = name;
		this.gid = gid;
	}
}
ClientTournament.instance = new ClientTournament({
	name: '',
	date: '',
	emptySlots: 0,
	restriction: '',
	registered: false,
	state: 'not registered',
	nextMatches: [],
	results: [],
	round: 0,
	gid: '',
});
export class Play {
	constructor(gid, opponent) {
		this.opponent = opponent;
		this.gid = gid;
	}
}
Play.instance = new Play('');
export class Pool {
	constructor(pool) {
		this.pool = pool;
	}
}
Pool.instance = new Pool([]);
export class Invitations {
	constructor(invitations) {
		this.invitations = invitations;
	}
}
Invitations.instance = new Invitations([]);
export class ClientPong {
	constructor({ playerScore, opponentScore, ball, rightPaddle, leftPaddle, sound }) {
		this.sound = sound;
		this.playerScore = playerScore;
		this.opponentScore = opponentScore;
		this.ballX = Math.ceil(ball.pos.x);
		this.ballY = Math.ceil(ball.pos.y);
		this.ballRadius = Math.ceil(Main.BallRadius);
		this.paddleRadius = Math.ceil(Main.PaddleRadius);
		this.rightPaddlePosX = Math.ceil(rightPaddle.pos.x);
		this.rightPaddlePosY = Math.ceil(rightPaddle.pos.y);
		this.leftPaddlePosX = Math.ceil(leftPaddle.pos.x);
		this.leftPaddlePosY = Math.ceil(leftPaddle.pos.y);
		this.paddleHeight = Math.ceil(2 * Main.PaddleHeight);
	}
}
export class ClientCardOfDoom {
	constructor({ cards, myturn, timer }) {
		this.myturn = myturn;
		this.timer = timer;
		this.cards = cards;
	}
}
// ! req -------------------------------------------------------------------------
// * Pool
export class Register {
	constructor(alias, creator) {
		this.creator = creator;
		this.alias = alias;
	}
}
Register.instance = new Register('', '');
export class Create {
	constructor(name, max, alias) {
		this.alias = alias;
		this.name = name;
		this.max = max;
	}
}
Create.instance = new Create('', 0, '');
export class Invite {
	constructor(recipient) {
		this.recipient = recipient;
	}
}
Invite.instance = new Invite('');
// * Game
export class Hook {
	constructor(gid, up, down) {
		this.up = up;
		this.gid = gid;
		this.down = down;
	}
}
Hook.instance = new Hook('', false, false);
export class Flip {
	constructor(gid, pos) {
		this.gid = gid;
		this.pos = pos;
	}
}
Flip.instance = new Flip('', 0);

export class TournamentOverview {
	id;
	name;
	date;
	state;
	creator;
	constructor({ state, id, name, date, creator }) {
		this.id = id;
		this.name = name;
		this.date = date;
		this.state = state;
		this.creator = creator;
	}
}
TournamentOverview.instance = new TournamentOverview({ state: '', id: 0, name: '', creator: '', date: '0' });

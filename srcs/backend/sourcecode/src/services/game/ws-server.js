import { mdb, PongWidth } from './index.js';
import _ from 'lodash';
export class Message {
	constructor({ username, hash, message, data, game }) {
		this.data = JSON.stringify(data);
		this.username = username;
		this.message = message;
		this.hash = hash;
		this.game = game;
	}
}
Message.instance = new Message({ username: '', hash: '', message: '', data: {}, game: 'pong' });
export class WSError {
	constructor(error) {
		this.message = error;
	}
}
WSError.instance = new WSError('');
export class Hash {
	constructor(username, hash) {
		this.username = username;
		this.hash = hash;
	}
}
Hash.instance = new Hash('', '');
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
	constructor({ name, date, emptySlots, state, results, registered, nextMatches, round, gid }) {
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
ClientTournament.instance = new ClientTournament({ name: '', date: '', emptySlots: 0, registered: false, state: 'not open', results: [], nextMatches: [], round: 0, gid: '' });
// ! res ------------------------------------------------------------------------------------------
// * Pool
export class Play {
	constructor(gid) {
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
	constructor({ playerScore, opponentScore, ball, rightPaddle, leftPaddle, start, stop, won, lost, tinychat, sound }) {
		this.start = false;
		this.stop = false;
		this.lost = false;
		this.won = false;
		this.sound = sound;
		this.tinychat = tinychat;
		this.playerScore = playerScore;
		this.opponentScore = opponentScore;
		this.ballX = Math.ceil(ball.pos.x);
		this.ballY = Math.ceil(ball.pos.y);
		this.ballRadius = Math.ceil(ball.radius);
		this.paddleRadius = Math.ceil(rightPaddle.radius);
		this.rightPaddlePosX = Math.ceil(rightPaddle.pos.x);
		this.rightPaddlePosY = Math.ceil(rightPaddle.pos.y);
		this.leftPaddlePosX = Math.ceil(leftPaddle.pos.x);
		this.leftPaddlePosY = Math.ceil(leftPaddle.pos.y);
		this.paddleHeight = Math.ceil(rightPaddle.length);
		this.start = start !== undefined ? start : false;
		this.stop = stop !== undefined ? stop : false;
		this.lost = lost !== undefined ? lost : false;
		this.won = won !== undefined ? won : false;
	}
}
export function transformFrame(f) {
	return {
		...f,
		ballY: f.ballY,
		ballX: PongWidth - f.ballX,
		ballRadius: f.ballRadius,
		paddleHeight: f.paddleHeight,
		paddleRadius: f.paddleRadius,
		leftPaddlePosY: f.rightPaddlePosY,
		rightPaddlePosY: f.leftPaddlePosY,
		leftPaddlePosX: PongWidth - f.rightPaddlePosX,
		rightPaddlePosX: PongWidth - f.leftPaddlePosX,
	};
}
export class ClientCardOfDoom {
	constructor({ cards, myturn, timer, start, stop, lost, won, tinychat }) {
		this.start = false;
		this.stop = false;
		this.lost = false;
		this.won = false;
		this.tinychat = tinychat;
		this.myturn = myturn;
		this.timer = timer;
		this.start = start;
		this.cards = cards;
		this.stop = stop;
		this.lost = lost;
		this.won = won;
	}
}
// ! req -------------------------------------------------------------------------
// * Pool
export class Register {
	constructor(alias) {
		this.alias = alias;
	}
}
Register.instance = new Register('');
export class Engage {
	constructor(gid) {
		this.gid = gid;
	}
}
Engage.instance = new Engage('');
export class Invite {
	constructor(recipient) {
		this.recipient = recipient;
	}
}
Invite.instance = new Invite('');
export class TinyChat {
	constructor(message, gid) {
		this.message = message;
		this.gid = gid;
	}
}
TinyChat.instance = new TinyChat('', '');
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
// ? Comminication Helpers
export function Json({ message, target }) {
	const json = JSON.parse(message);
	const properties = Object.getOwnPropertyNames(json);
	Object.getOwnPropertyNames(target).forEach((property) => {
		if (_.includes(properties, property) === false) throw new Error('Invalid JSON');
	});
	return json;
}
// * OTHER : ERROR
export function ErrorMessage(error) {
	return JSON.stringify(new Message({ username: '', hash: '', game: 'pong', message: 'ERROR', data: new WSError(error) }));
}
// * POOL : HASH | PLAY | POOL | INVITATIONS
export function HashMessage(username, hash, game) {
	return JSON.stringify(new Message({ username, hash, message: 'HASH', game, data: new Hash(username, hash) }));
}
export function PlayMessage(username, hash, game, gid) {
	return JSON.stringify(new Message({ username, hash, message: 'PLAY', game, data: new Play(gid) }));
}
export function PoolMessage(username, hash, game, getClientPlayers) {
	return JSON.stringify(new Message({ username, hash, message: 'POOL', game, data: new Pool(getClientPlayers()) }));
}
export function InvitationMessage(username, hash, game, getInvitions) {
	return JSON.stringify(new Message({ username, hash, message: 'INVITATIONS', game, data: new Invitations(getInvitions()) }));
}
export function TournamentMessage(username, hash, game, clientTournament) {
	return JSON.stringify(new Message({ username, hash, message: 'TOURNAMENT', game, data: clientTournament }));
}
// * GAME : PONG | CARDOFDOOM
export function PongMessage(username, hash, game, clientPong) {
	return JSON.stringify(new Message({ username, hash, message: 'PONG', game, data: clientPong }));
}
export function DoomMessage(username, hash, game, clientCardOfDoom) {
	return JSON.stringify(new Message({ username, hash, message: 'DOOM', game, data: clientCardOfDoom }));
}
/************************************************************************************************************************
 *                                                        PARSER                                                        *
 ************************************************************************************************************************/
export function useParser(json, socket) {
	const { username, message, hash, game, data } = Json({ message: json, target: Message.instance });
	if (message !== 'CONNECT' && hash !== mdb.getPlayerHash(username)) throw new Error('hash mismatch');
	console.log(username, message);
	switch (message) {
		case 'CONNECT': {
			mdb.addPlayer(mdb.createPlayer(username, socket));
			break;
		}
		case 'REGISTER': {
			mdb.register(username, Json({ message: data, target: Register.instance }).alias);
			break;
		}
		case 'ENGAGE': {
			mdb.connectPlayer(username, Json({ message: data, target: Engage.instance }).gid, game);
			break;
		}
		case 'INVITE': {
			mdb.createInvitation(username, Json({ message: data, target: Invite.instance }).recipient, game);
			break;
		}
		case 'ACCEPT': {
			mdb.acceptInvitation(Json({ message: data, target: Invite.instance }).recipient, username);
			break;
		}
		case 'REJECT': {
			mdb.declineInvitation(Json({ message: data, target: Invite.instance }).recipient, username);
			break;
		}
		case 'DELETE': {
			const invite = Json({ message: data, target: Invite.instance });
			if (invite.recipient === '*') mdb.deleteAllRejectedInvitations(username);
			else mdb.cancelInvitation(invite.recipient, username);
			break;
		}
		case 'HOOK': {
			mdb.roomHook(username, Json({ message: data, target: Hook.instance }));
			break;
		}
		case 'FLIP': {
			mdb.roomFlip(username, Json({ message: data, target: Flip.instance }));
			break;
		}
		case 'TYNICHAT': {
			mdb.roomTinyChat(username, Json({ message: data, target: TinyChat.instance }));
			break;
		}
		default:
			throw new Error('UNKNOWN COMMAND');
	}
}
// * Main Loop
export function main(createGamePong, createTournament, addPlayerToTournament) {
	setInterval(() => {
		mdb.deleteExpiredInvitations();
		mdb.updateTournament(createTournament, addPlayerToTournament);
		mdb.updateRooms(createGamePong);
		mdb.sendPool();
		mdb.sendGame();
		mdb.sendInvitations();
		mdb.sendTournament();
	}, 1000 / 60);
}

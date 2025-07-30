import { randomUUID } from 'crypto';
import { uniqueNamesGenerator, adjectives, starWars } from 'unique-names-generator';
import { format } from 'date-fns';
import {
	Pong,
	Doom,
	timeLimite,
	MaxPlayers,
	ClientPong,
	DoomMessage,
	PlayMessage,
	PongMessage,
	PoolMessage,
	HashMessage,
	ClientPlayer,
	generateHash,
	transformFrame,
	ClientCardOfDoom,
	ClientInvitation,
	ClientTournament,
	InvitationMessage,
	invitationTimeout,
	roomFinishTimeout,
	TournamentMessage,
	roomConnectionTimeout,
} from './index.js';
export class Invitation {
	constructor(sender, recipient, game) {
		this.invite_status = 'pending';
		this.created_at = Date.now();
		this.recipient = recipient;
		this.sender = sender;
		this.game = game;
	}
}
export class Player {
	constructor(username, socket) {
		this.prevPool = '';
		this.prevTournament = '';
		this.prevInvitations = '';
		this.username = username;
		this.socket = socket;
	}
}
export class Room {
	constructor(pu, ou) {
		this.playerTinyChat = '';
		this.opponentTinyChat = '';
		this.date_at = Date.now();
		this.game = null;
		this.roomState = 'connecting';
		this.opponent = ou;
		this.player = pu;
	}
}
export class Tournament {
	constructor() {
		this.name = '';
		this.due_date = 0;
		this.currentLevel = 0;
		this.state = 'finished';
		this.matches = new Set();
		this.maxPlayers = MaxPlayers;
		this.registeredPlayers = new Set();
		this.newTournament();
	}
	newTournament() {
		const customConfig = {
			dictionaries: [adjectives, starWars],
			separator: '-',
			length: 2,
		};
		const date = new Date();
		this.matches.clear();
		this.currentLevel = 0;
		this.state = 'not open';
		this.registeredPlayers.clear();
		this.name = uniqueNamesGenerator(customConfig);
		this.due_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 1).getTime();
	}
	register(player, alias) {
		if (Date.now() < this.due_date) throw new Error('Registration is not open yet my friend');
		if (this.registeredPlayers.size >= this.maxPlayers) throw new Error('Tournament is Full');
		if (![...this.registeredPlayers].some((e) => e.username === player)) this.registeredPlayers.add({ alias, username: player, level: 0 });
		if (this.registeredPlayers.size === this.maxPlayers) this.state = 'playing';
	}
	levelup(player) {
		for (const p of this.registeredPlayers) if (p.username === player) p.level += 1;
	}
	registerRoomResult(room, key) {
		this.matches.forEach((match) => {
			if (match.GID === key) {
				if (room.game) {
					if (room.game.winner === match.player) this.levelup(match.player);
					else this.levelup(match.opponent);
				}
				this.matches.delete(match);
				return;
			}
		});
	}
}
class Mdb {
	constructor() {
		this.invitations = new Map();
		this.players = new Map();
		this.rooms = new Map();
		this.tournament = new Tournament();
	}
	// * create player
	createPlayer(username, socket) {
		const player = new Player(username, socket);
		const hash = generateHash(username);
		socket.username = username;
		socket.PLAYFREE = true;
		socket.hash = hash;
		socket.gid = '';
		return player;
	}
	/***************************************************************************************************************
	 *                                        TOURNAMENT TABLE MANIPULATION                                        *
	 ***************************************************************************************************************/
	updateTournament(createTournament, addPlayerToTournament) {
		switch (this.tournament.state) {
			case 'not open': {
				if (Date.now() >= this.tournament.due_date) this.tournament.state = 'open';
				break;
			}
			case 'open': {
				break;
			}
			case 'playing': {
				[...this.tournament.matches].forEach((ele) => {
					if (ele.finished) this.tournament.matches.delete(ele);
				});
				if (this.tournament.matches.size === 0) {
					// TODO: Next Matches
					const winners = [...this.tournament.registeredPlayers].filter((e) => e.level === this.tournament.currentLevel).sort();
					if (winners.length === 1 || winners.length === 0) this.tournament.state = 'finished';
					else {
						this.tournament.matches.clear();
						for (let i = 0; i < winners.length; i++) {
							if (i + 1 < winners.length) {
								this.createTournamentMatch(winners[i], winners[i + 1]);
								i++;
							} else {
								this.tournament.levelup(winners[i].username);
							}
						}
						this.tournament.currentLevel += 1;
					}
				}
				break;
			}
			case 'finished': {
				createTournament({ tournamentName: this.tournament.name, tournamentDate: this.tournament.due_date });
				for (const p of this.tournament.registeredPlayers) {
					addPlayerToTournament({ username: p.username, tournamentName: this.tournament.name, playerLevel: p.level });
				}
				this.tournament.newTournament();
				break;
			}
		}
	}
	createTournamentMatch(player, opponent) {
		const GID = randomUUID();
		this.tournament.matches.add({ player: player.username, opponent: opponent.username, playerAlias: player.alias, opponentAlias: opponent.alias, finished: false, GID });
		this.rooms.set(GID, new Room(player.username, opponent.username));
	}
	register(username, alias) {
		this.tournament.register(username, alias);
	}
	/***************************************************************************************************************
	 *                                           ROOM TABLE MANIPULATION                                           *
	 ***************************************************************************************************************/
	// * new room
	addRoom(player, opponent, game, GID) {
		const sen = this.getPlayer(player);
		const rec = this.getPlayer(opponent);
		sen.socket.send(PlayMessage(sen.username, sen.socket.hash, game, GID));
		rec.socket.send(PlayMessage(rec.username, rec.socket.hash, game, GID));
		this.rooms.set(GID, new Room(player, opponent));
	}
	// * remove room
	getRoom(gid) {
		const r = this.rooms.get(gid);
		if (r === undefined) throw new Error("Room doesn't exists");
		return r;
	}
	// * remove room
	removeRoom(room, key) {
		this.tournament.registerRoomResult(room, key);
		this.rooms.delete(key);
	}
	// * connnect player to a room
	connectPlayer(username, gid, game) {
		const room = this.getRoom(gid);
		const player = this.getPlayer(username);
		if (username !== room.player && username !== room.opponent) throw new Error('You are not allowed to be here');
		if (room.roomState === 'player-1-connected') room.roomState = 'player-2-connected';
		else if (room.roomState === 'connecting') room.roomState = 'player-1-connected';
		player.socket.PLAYFREE = false;
		player.socket.gid = gid;
		if (room.roomState === 'player-2-connected') {
			room.roomState = 'playing';
			if (game === 'pong') room.game = new Pong(room.player, room.opponent);
			else room.game = new Doom(room.player, room.opponent);
			room.date_at = Date.now();
		}
	}
	disconnectPlayer(player) {
		player.socket.PLAYFREE = true;
		player.socket.gid = '';
	}
	// * room hook
	roomHook(username, hook) {
		const r = this.getRoom(hook.gid);
		if (r.game && r.game instanceof Pong) {
			if (r.player === username) r.game.keyPressLeft(hook.up, hook.down);
			if (r.opponent === username) r.game.keyPressRight(hook.up, hook.down);
		}
	}
	roomFlip(username, flip) {
		const r = this.getRoom(flip.gid);
		if (r.game && r.game instanceof Doom && (username === r.player || username === r.opponent)) r.game.flip(username, flip.pos);
	}
	roomTinyChat(username, tiny) {
		const r = this.getRoom(tiny.gid);
		if (r.game && tiny.message.length <= 100 && (username === r.player || username === r.opponent)) {
			if (username === r.player) r.opponentTinyChat = tiny.message;
			else r.playerTinyChat = tiny.message;
		}
	}
	// * update rooms
	updateRooms(createGamePong) {
		this.rooms.forEach((room, key) => {
			if (room.game && room.game.update()) {
				this.tournament.registerRoomResult(room, key);
				room.roomState = 'finished';
				room.date_at = Date.now();
				if (room.game instanceof Pong) {
					createGamePong({
						userUsername: room.player,
						opponentUsername: room.opponent,
						userScore: room.game.playerScore,
						opponentScore: room.game.opponentScore,
						gameDate: room.date_at,
					});
				}
				room.game = null;
			}
			if (room.roomState === 'connecting' && Date.now() - room.date_at > roomConnectionTimeout) this.removeRoom(room, key);
			else if (room.roomState === 'disconnected' && Date.now() - room.date_at > roomFinishTimeout) this.removeRoom(room, key);
			else if (room.roomState === 'finished' && Date.now() - room.date_at > roomFinishTimeout) this.removeRoom(room, key);
		});
	}
	/****************************************************************************************************************
	 *                                        PLAYERS TABLE MANIPULATION                                            *
	 ****************************************************************************************************************/
	// * add player
	addPlayer(player) {
		if (this.players.has(player.username)) throw new Error('Player already exists');
		this.players.set(player.username, player);
		player.socket.send(HashMessage(player.username, player.socket.hash, 'pong'));
	}
	// * remove player
	removePlayer(username) {
		this.players.delete(username);
	}
	// * get player Hash
	getPlayerHash(username) {
		const player = this.players.get(username);
		if (!player) throw new Error("Player-hash doesn't exists");
		return player.socket.hash;
	}
	// * get player
	getPlayer(username) {
		const player = this.players.get(username);
		if (!player) throw new Error("Player-object doesn't exists");
		return player;
	}
	getPool(username) {
		const pool = [];
		this.players.forEach((value) => {
			if (value.username !== username) {
				try {
					const i = this.getInvitation(username, value.username);
					pool.push(new ClientPlayer(value.username, i.game, value.socket.PLAYFREE === true ? 'free' : 'playing', i.invite_status));
					// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
				} catch (err) {
					pool.push(new ClientPlayer(value.username, 'pong', value.socket.PLAYFREE === true ? 'free' : 'playing', 'unsent'));
				}
			}
		});
		return pool;
	}
	/****************************************************************************************************************
	 *                                      INVITATIONS TABLE MANIPULATION                                          *
	 ****************************************************************************************************************/
	// ? invite_status manipulation queries
	getInvitation(sender, recipient) {
		const invite = this.invitations.get(sender + recipient);
		if (!invite) throw new Error(sender + recipient + ': no such invitation');
		return invite;
	}
	// * create invitation
	createInvitation(sender, recipient, game) {
		if (sender === recipient) throw new Error('invited yourself, pretty smart huh!!');
		const sen = this.getPlayer(sender);
		const rec = this.getPlayer(recipient);
		if (rec.socket.PLAYFREE === false) throw new Error(rec.username + ' is currently playing');
		if (this.invitations.has(sen.username + rec.username)) return;
		this.invitations.set(sen.username + rec.username, new Invitation(sen.username, rec.username, game));
	}
	// * update accepted invitation
	acceptInvitation(sender, recipient) {
		const invite = this.getInvitation(sender, recipient);
		if (invite.invite_status === 'pending') {
			invite.invite_status = 'accepted';
			this.cancelInvitation(sender, recipient);
			this.addRoom(sender, recipient, invite.game, randomUUID());
		}
	}
	// * update declined invitation
	declineInvitation(sender, recipient) {
		const invite = this.getInvitation(sender, recipient);
		if (invite.invite_status === 'pending') invite.invite_status = 'declined';
	}
	// * cancel invitation
	cancelInvitation(sender, recipient) {
		this.invitations.delete(sender + recipient);
	}
	// * delete all expired invitation
	deleteExpiredInvitations() {
		this.invitations.forEach((value, key) => {
			if (Date.now() - value.created_at > invitationTimeout) this.invitations.delete(key);
		});
	}
	// * cancel all player invitations
	cancelAllPlayerInvitations(sender) {
		this.invitations.forEach((value, key) => {
			if (value.sender === sender) this.invitations.delete(key);
		});
	}
	// * delete all rejected invitation for a specific user
	deleteAllRejectedInvitations(sender) {
		this.invitations.forEach((value, key) => {
			if (value.sender === sender && value.invite_status === 'declined') this.invitations.delete(key);
		});
	}
	// * get all player invitations
	getAllPlayerInvitations(username) {
		const invitations = [];
		this.invitations.forEach((value) => {
			if (value.recipient === username) invitations.push(new ClientInvitation(value.sender, value.game, value.invite_status));
		});
		return invitations;
	}
	/************************************************************************************************************************
	 *                                                         MAIN                                                         *
	 ************************************************************************************************************************/
	sendGame() {
		this.players.forEach((player) => {
			try {
				if (player.socket.OPEN && player.socket.PLAYFREE === false) {
					const { roomState, game, opponent, playerTinyChat, opponentTinyChat } = mdb.getRoom(player.socket.gid);
					if (game && game instanceof Pong) {
						const { ball, leftPaddle, rightPaddle, playerScore, opponentScore, winner, sound } = game;
						let clientPong = new ClientPong({
							ball,
							sound,
							leftPaddle,
							rightPaddle,
							won: winner === player.username,
							stop: roomState === 'disconnected',
							lost: winner !== '' && winner !== player.username,
							playerScore: player.username === opponent ? playerScore : opponentScore,
							opponentScore: player.username === opponent ? opponentScore : playerScore,
							tinychat: player.username === opponent ? playerTinyChat : opponentTinyChat,
							start: roomState !== 'connecting' && roomState !== 'player-1-connected' && roomState !== 'player-2-connected',
						});
						if (player.username !== opponent) clientPong = transformFrame(clientPong);
						player.socket.send(PongMessage(player.username, player.socket.hash, 'pong', clientPong));
						if (clientPong.won || clientPong.lost || clientPong.stop) this.disconnectPlayer(player);
					} else if (game && game instanceof Doom) {
						const { winner, myturn, timer } = game;
						const clientDoom = new ClientCardOfDoom({
							cards: game.getMap(),
							won: winner === player.username,
							myturn: myturn === player.username,
							stop: roomState === 'disconnected',
							lost: winner !== '' && winner !== player.username,
							timer: Math.ceil((timeLimite - (Date.now() - timer)) / 1000),
							tinychat: player.username === opponent ? playerTinyChat : opponentTinyChat,
							start: roomState !== 'connecting' && roomState !== 'player-1-connected' && roomState !== 'player-2-connected',
						});
						player.socket.send(DoomMessage(player.username, player.socket.hash, 'doom', clientDoom));
						if (clientDoom.won || clientDoom.lost || clientDoom.stop) this.disconnectPlayer(player);
					}
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
			} catch (err) {
				player.socket.PLAYFREE = true;
				player.socket.gid = '';
			}
		});
	}
	sendTournament() {
		this.players.forEach((player) => {
			if (player.socket.OPEN && player.socket.PLAYFREE === true) {
				const { name, due_date, registeredPlayers, maxPlayers, matches, state, currentLevel } = this.tournament;
				const clientMatches = new Set();
				let gid = '';
				matches.forEach((e) => {
					if (e.player === player.username || e.opponent === player.username) gid = e.GID;
					clientMatches.add({ player: e.player, opponent: e.opponent, finished: e.finished });
				});
				const m = TournamentMessage(
					player.username,
					player.socket.hash,
					'pong',
					new ClientTournament({
						gid,
						name,
						state,
						round: currentLevel,
						results: [...registeredPlayers],
						nextMatches: [...clientMatches],
						date: format(due_date, 'yyyy-MM-dd HH:mm'),
						emptySlots: maxPlayers - registeredPlayers.size,
						registered: [...registeredPlayers].some((e) => e.username === player.username),
					})
				);
				if (m !== player.prevTournament) {
					player.prevTournament = m;
					player.socket.send(m);
				}
			}
		});
	}
	sendInvitations() {
		this.players.forEach((player) => {
			if (player.socket.OPEN && player.socket.PLAYFREE === true) {
				const m = InvitationMessage(player.username, player.socket.hash, 'pong', () => this.getAllPlayerInvitations(player.username));
				if (m !== player.prevInvitations) {
					player.prevInvitations = m;
					player.socket.send(m);
				}
			}
		});
	}
	sendPool() {
		this.players.forEach((player) => {
			if (player.socket.OPEN && player.socket.PLAYFREE === true) {
				const m = PoolMessage(player.username, player.socket.hash, 'pong', () => this.getPool(player.username));
				if (m !== player.prevPool) {
					player.socket.send(m);
					player.prevPool = m;
				}
			}
		});
	}
}
export const mdb = new Mdb();

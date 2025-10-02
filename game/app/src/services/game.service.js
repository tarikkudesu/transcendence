import AppError from '../utils/AppError.js';
import * as Main from './game/index.js';

if (process.env.NODE_ENV === 'production') console.log = () => {};

class GameService {
	constructor(fastify, userRepo, gameRepo, playerRepo, tournamentRepo, friendRepo) {
		this.users = userRepo;
		this.games = gameRepo;
		this.friends = friendRepo;
		this.contestants = playerRepo;
		this.tournaments = tournamentRepo;
		this.publishInNotifQueue = fastify.publishInNotifQueue;
		this.main();
	}

	main() {
		setInterval(() => {
			this.updateRooms();
			this.updateTournaments();
			Main.sendTournament();
			Main.sendInvitations();
			Main.sendPool(this.amIAFriendOfHis.bind(this));
			Main.deleteExpiredInvitations();
		}, 1000 / 60);
	}

	amIAFriendOfHis({ username, potentialFriend }) {
		const res = this.friends.countFriendship(username, potentialFriend);
		return res.count;
	}

	async updateTournamentWinner({ tournamentName, winner }) {
		const user = this.users.findUserByUsername(winner);
		if (user) this.tournaments.updateTournamentWinner(tournamentName, user.id);
	}

	async createGamePong({ playerUsername, opponentUsername, playerScore, opponentScore, gameDate, tournamentName }) {
		const user = this.users.findUserByUsername(playerUsername);
		const opponent = this.users.findUserByUsername(opponentUsername);
		if (!user || !opponent) return { success: false };
		const winner_id = playerScore > opponentScore ? user.id : opponent.id;
		const tournament = tournamentName ? this.tournaments.findTournamentByName(tournamentName) : undefined;
		this.games.addGamePong(user.id, opponent.id, playerScore, opponentScore, winner_id, tournament?.id, gameDate);
		return { success: true };
	}

	async createGameDoom({ playerUsername, opponentUsername, winnerUsername, gameDate }) {
		console.log(playerUsername, opponentUsername);
		const user = this.users.findUserByUsername(playerUsername);
		const opponent = this.users.findUserByUsername(opponentUsername);
		if (!user || !opponent || (winnerUsername !== playerUsername && winnerUsername !== opponentUsername)) return { success: false };
		const winner_id = winnerUsername === playerUsername ? user.id : opponent.id;
		this.games.addGameDoom(user.id, opponent.id, winner_id, gameDate);
		return { success: true };
	}

	async getHistoryUserPong(username, { begin, end }) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		return this.games.getHistoryUserPong(user.id, begin, end);
	}

	async getHistoryUserDoom(username, { begin, end }) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		return this.games.getHistoryUserDoom(user.id, begin, end);
	}

	async getUserPongSummary(username) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		return {
			total_games: this.games.getTotalPongGamesById(user.id),
			total_winns: this.games.getTotalWinsPongById(user.id),
			totalTournamentPlayed: this.contestants.getTotalTournamentsPlayed(user.id),
			totalTournamentWinns: this.tournaments.getTotalTournamentsWinns(user.id),
		};
	}

	async getUserDoomSummary(username) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		return {
			total_games: this.games.getTotalGamesDoomById(user.id),
			total_winns: this.games.getTotalWinsDoomById(user.id),
		};
	}

	async getLeaderBoardDoom(from, limit) {
		from = from || 0;
		limit = limit || -1;
		return this.games.getLeaderBoardDoom(from, limit);
	}

	async getLeaderBoardPong(from, limit) {
		from = from || 0;
		limit = limit || -1;
		return this.games.getLeaderBoardPong(from, limit);
	}

	async getTournamentsHistory({ begin, end }) {
		return this.tournaments.getTournamentsHistory(begin, end);
	}

	async getTournamentsStats(name) {
		const tournament = this.tournaments.findTournamentByName(name);
		if (!tournament) throw new AppError('this Tournament not found', 404);
		const user = this.users.findUserById(tournament.winner_id);
		const contestants = this.contestants.findAllContestants(tournament.id);
		const matches = this.contestants.findAllMatches(tournament.id);
		return {
			Name: name,
			Date: tournament.tournament_date,
			Winner_username: user.username,
			Contestants: contestants,
			matches: matches,
		};
	}

	createTournament(username, name, max) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('createTournament(): user not found', 404);
		if (Main.repository.tournaments.has(username)) throw new Error('You can only host one live tournament at a time.');
		Main.newTournament(name, max, username);
		this.tournaments.createTournament(user.id, name, String(Date.now()), max);
	}

	addPlayerToTournament({ alias, username, tournamentName, roundLevel }) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('addPlayerToTournament(): user not found', 404);
		const tournament = this.tournaments.findTournamentByName(tournamentName);
		if (!tournament) throw new AppError('addPlayerToTournament(): tournament not found', 404);
		this.contestants.addPlayer(user.id, tournament.id, roundLevel, alias);
		return { success: true };
	}

	registerPlayer(username, alias, creator) {
		const user = this.users.findUserByUsername(creator);
		if (!user) throw new AppError('registerPlayer(): no such tournament', 404);
		const tournament = Main.repository.tournaments.get(creator);
		if (!tournament) throw new Error('registerPlayer(): No Such Tournament Memory Entry');
		tournament.register(username, alias);
	}

	/********************************************************************************************************
	 *                                           USER VERIFICATION                                          *
	 ********************************************************************************************************/

	verifyPongUser(username, socket, gid) {
		if (!Main.repository.rooms.has(gid)) return false;
		if (!this.users.findUserByUsername(username)) {
			socket.send(Main.ErrorMessage('You are not registered'));
			return false;
		}
		if (Main.checkPongPlayer(username)) {
			socket.send(Main.ErrorMessage('You are aleady connected'));
			return false;
		}
		Main.addPongPlayer(Main.createPlayer(username, socket, gid));
		Main.connectPlayer(username, 'pong');
		return true;
	}
	verifyDoomUser(username, socket, gid) {
		if (!Main.repository.rooms.has(gid)) return false;
		if (!this.users.findUserByUsername(username)) {
			socket.send(Main.ErrorMessage('You are not registered'));
			return false;
		}
		if (Main.checkDoomPlayer(username)) {
			socket.send(Main.ErrorMessage('You are aleady connected'));
			return false;
		}
		Main.addDoomPlayer(Main.createPlayer(username, socket, gid));
		Main.connectPlayer(username, 'card of doom');
		return true;
	}
	verifyUser(username, socket) {
		if (!this.users.findUserByUsername(username)) {
			socket.send(Main.ErrorMessage('You are not registered'));
			return false;
		}
		if (Main.checkPlayer(username)) {
			socket.send(Main.ErrorMessage('You are aleady connected'));
			return false;
		}
		return true;
	}

	/********************************************************************************************************
	 *                                             NOTIFICATIONS                                            *
	 ********************************************************************************************************/

	createMatchUpNotification(u_to) {
		this.publishInNotifQueue({
			service: 'game',
			event: 'TOURNAMENTMATCHUP',
			sender: 'Tournament System',
			receiver: u_to,
			date: Date.now(),
		});
	}
	createWonTournamentNotification(u_to) {
		this.publishInNotifQueue({
			service: 'game',
			event: 'TOURNAMENTWON',
			sender: 'Tournament System',
			receiver: u_to,
			date: Date.now(),
		});
	}

	/********************************************************************************************************
	 *                                                 GAME                                                 *
	 ********************************************************************************************************/

	updateRooms() {
		Main.repository.rooms.forEach((room, key) => {
			Main.updateRoom(room, key, this.createGamePong.bind(this), this.createGameDoom.bind(this));
		});
	}

	updateTournaments() {
		Main.repository.tournaments.forEach((tournament, key) => {
			this.updateTournament(tournament, key);
		});
	}

	updateTournament(tournament) {
		switch (tournament.state) {
			case 'open': {
				if (Date.now() - tournament.date >= Main.TournamentTimeout) Main.removeTournament(tournament.creator);
				break;
			}
			case 'playing': {
				[...tournament.matches].forEach((ele) => {
					if (ele.finished) tournament.matches.delete(ele);
				});
				if (tournament.matches.size === 0) {
					const winners = [...tournament.registeredPlayers]
						.filter((e) => e.level === tournament.currentLevel)
						.sort(() => Math.random() - 0.5);
					if (winners.length === 1 || winners.length === 0) tournament.state = 'finished';
					else {
						tournament.matches.clear();
						for (let i = 0; i < winners.length; i++) {
							if (i + 1 < winners.length) {
								tournament.createTournamentMatch(winners[i], winners[i + 1]);
								this.createMatchUpNotification(winners[i].username);
								this.createMatchUpNotification(winners[i + 1].username);
								i++;
							} else {
								tournament.levelup(winners[i].username);
							}
						}
						tournament.currentLevel += 1;
					}
				}
				break;
			}
			case 'finished': {
				let winner = '';
				let level = 0;
				for (const p of tournament.registeredPlayers)
					if (p.level > level) {
						level = p.level;
						winner = p.username;
					}

				for (const p of tournament.registeredPlayers)
					this.addPlayerToTournament({
						alias: p.alias,
						username: p.username,
						tournamentName: tournament.name,
						roundLevel: p.level,
					});
				this.updateTournamentWinner({ tournamentName: tournament.name, winner });
				this.createWonTournamentNotification(winner);
				Main.removeTournament(tournament.creator);
				break;
			}
		}
	}

	connectPlayer(username, game) {
		try {
			Main.connectPlayer(username, game);
		} catch (err) {
			console.log(err);
		}
	}

	/********************************************************************************************************
	 *                                                POOONG                                                *
	 ********************************************************************************************************/

	async pongCloseSocket(socket) {
		if (socket.username) Main.removeDoomPongPlayer(socket.username);
	}

	async pongEventEntry(socket, json) {
		const { username } = socket;
		try {
			const { message, data } = Main.Json({ message: json, target: Main.Message.instance });
			switch (message) {
				case 'HOOK': {
					Main.roomHook(username, Main.Json({ message: data, target: Main.Hook.instance }));
					break;
				}
				default:
					throw new Error('UNKNOWN COMMAND');
			}
		} catch (err) {
			socket.send(Main.ErrorMessage(err?.message ?? "you didn't pong good enough"));
			console.error('Error', err.message);
		}
	}

	/********************************************************************************************************
	 *                                                DOOOOM                                                *
	 ********************************************************************************************************/

	async doomCloseSocket(socket) {
		if (socket.username) Main.removeDoomPongPlayer(socket.username);
	}

	async doomEventEntry(socket, json) {
		const { username } = socket;
		try {
			const { message, data } = Main.Json({ message: json, target: Main.Message.instance });
			switch (message) {
				case 'FLIP': {
					Main.roomFlip(username, Main.Json({ message: data, target: Main.Flip.instance }));
					break;
				}
				default:
					throw new Error('UNKNOWN COMMAND');
			}
		} catch (err) {
			socket.send(Main.ErrorMessage(err?.message ?? "you didn't pong good enough"));
			console.error(err);
		}
	}

	/********************************************************************************************************
	 *                                                SOCKET                                                *
	 ********************************************************************************************************/

	async closeSocket(socket) {
		if (socket.username) {
			Main.cancelAllPlayerInvitations(socket.username);
			Main.removePlayer(socket.username);
		}
	}

	async eventEntry(socket, json) {
		const { username } = socket;
		try {
			const { message, game, data } = Main.Json({ message: json, target: Main.Message.instance });
			switch (message) {
				case 'REGISTER': {
					const j = Main.Json({ message: data, target: Main.Register.instance });
					if (!this.validator(j.alias)) throw new Error('Invalid alias');
					this.registerPlayer(username, j.alias, j.creator);
					break;
				}
				case 'INVITE': {
					const { recipient } = Main.Json({ message: data, target: Main.Invite.instance });
					if (this.amIAFriendOfHis({ username, potentialFriend: recipient }) === 1)
						Main.createInvitation(username, recipient, game);
					else throw new Error('his is not your friend, maybe send him an invitation first');
					break;
				}
				case 'CREATE': {
					const t = Main.Json({ message: data, target: Main.Create.instance });
					if (!this.validator(t.name)) throw new Error('Invalid tournament name');
					if (!this.validator(t.alias)) throw new Error('Invalid alias');
					this.createTournament(username, t.name, t.max);
					this.registerPlayer(username, t.alias, username);
					break;
				}
				case 'ACCEPT': {
					const a = Main.Json({ message: data, target: Main.Invite.instance });
					if (this.amIAFriendOfHis({ username, potentialFriend: a.recipient }) === 1) {
						Main.playerInRoom(username);
						Main.playerInRoom(a.recipient);
						Main.acceptInvitation(a.recipient, username);
					} else throw new Error('his is not your friend, maybe send him an invitation first');
					break;
				}
				case 'REJECT': {
					const r = Main.Json({ message: data, target: Main.Invite.instance });
					if (this.amIAFriendOfHis({ username, potentialFriend: r.recipient }) === 1)
						Main.declineInvitation(r.recipient, username);
					else throw new Error('his is not your friend, maybe send him an invitation first');
					break;
				}
				case 'DELETE': {
					Main.cancelInvitation(Main.Json({ message: data, target: Main.Invite.instance }).recipient, username);
					break;
				}
				default:
					throw new Error('UNKNOWN COMMAND');
			}
		} catch (err) {
			socket.send(Main.ErrorMessage(err?.message ?? "you didn't pong good enough"));
			console.error('Error', err);
		}
	}

	/********************************************************************************************
	 *                                    schema-validation                                     *
	 ********************************************************************************************/

	validator(input) {
		const pattern = /^[A-Za-z0-9][A-Za-z0-9 ]*[A-Za-z0-9]$/;
		return typeof input === 'string' && input.length < 20 && pattern.test(input);
	}
}

export default GameService;

import AppError from '../utils/AppError.js';
import * as Main from './game/index.js';

class GameService {
	constructor(userRepo, gameRepo, playerRepo, tournamentRepo) {
		this.users = userRepo;
		this.games = gameRepo;
		this.contestants = playerRepo;
		this.tournaments = tournamentRepo;
		Main.main(
			this.createGamePong.bind(this),
			this.createGameDoom.bind(this),
			this.createTournament.bind(this),
			this.addPlayerToTournament.bind(this),
			this.updateTournamentWinner.bind(this)
		);
	}

	async updateTournamentWinner({ tournamentName, winner }) {
		const user = this.users.findUserByUsername(winner);
		if (!user) throw new AppError('updateTournament(): this user not found', 404);
		this.tournaments.updateTournamentWinner(tournamentName, user.id);
	}

	async createGamePong({ userUsername, opponentUsername, userScore, opponentScore, gameDate, tournamentName }) {
		const user = this.users.findUserByUsername(userUsername);
		const opponent = this.users.findUserByUsername(opponentUsername);
		if (!user || !opponent) throw new AppError('createGamePong(): this user not found', 404);
		const winner_id = userScore > opponentScore ? user.id : opponent.id;
		const tournament = tournamentName ? this.tournaments.findTournamentByName(tournamentName) : undefined;
		this.games.addGamePong(user.id, opponent.id, userScore, opponentScore, winner_id, tournament?.id, gameDate);
		return { success: true };
	}

	async createGameDoom({ userUsername, opponentUsername, winnerUsername, gameDate }) {
		const user = this.users.findUserByUsername(userUsername);
		const opponent = this.users.findUserByUsername(opponentUsername);
		if (!user || !opponent || (winnerUsername !== userUsername && winnerUsername !== opponentUsername))
			throw new AppError('createGameDoom(): user not found', 404);
		const winner_id = winnerUsername === userUsername ? user.id : opponent.id;
		this.games.addGameDoom(user.id, opponent.id, winner_id, gameDate);
		return { success: true };
	}

	async createTournament({ tournamentName, tournamentDate }) {
		this.tournaments.createTournament(tournamentName, tournamentDate);
		return { success: true };
	}

	async addPlayerToTournament({ username, tournamentName, roundLevel }) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('addPlayerToTournament(): user not found', 404);
		const tournament = this.tournaments.findTournamentByName(tournamentName);
		if (!tournament) throw new AppError('addPlayerToTournament(): tournament not found', 404);
		this.contestants.addPlayer(user.id, tournament.id, roundLevel);
		return { success: true };
	}

	async getLeaderBoardPong() {
		const result = this.games.getLeaderBoardPong();
		return { success: true, leaderboard: result };
	}

	async getHistoryUserPong(username) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		const history = this.games.getHistoryUserPong(user.id);
		return { success: true, history: history };
	}

	async getUserPongSummary(username) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		const stats = {
			total_games: this.games.getTotalPongGamesById(user.id),
			total_winns: this.games.getTotalWinsPongById(user.id),
			totalTournamentPlayed: this.contestants.getTotalTournamentsPlayed(user.id),
			totalTournamentWinns: this.tournaments.getTotalTournamentsWinns(user.id),
		};
		return { success: true, stats: stats };
	}

	async getUserDoomSummary(username) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		const stats = {
			total_games: this.games.getTotalGamesDoomById(user.id),
			total_winns: this.games.getTotalWinsDoomById(user.id),
		};
		return { success: true, stats: stats };
	}

	async getHistoryUserDoom(username) {
		const user = this.users.findUserByUsername(username);
		if (!user) throw new AppError('this user not found', 404);
		const history = this.games.getHistoryUserDoom(user.id);
		return { success: true, history: history };
	}

	async getLeaderBoardDoom() {
		const result = this.games.getLeaderBoardDoom();
		return { success: true, leaderboard: result };
	}

	async getTournamentsHistory() {
		const result = this.tournaments.getTournamentsHistory();
		return { success: true, history: result };
	}

	async getTournamentsStats(name) {
		const tournament = this.tournaments.findTournamentByName(name);
		if (!tournament) throw new AppError('this Tournament not found', 404);
		const user = this.users.findUserById(tournament.winner_id);
		const contestants = this.contestants.findAllContestants(tournament.id);
		const matches = this.contestants.findAllMatches(tournament.id);
		const stats = {
			Name: name,
			Date: tournament.tournament_date,
			Winner_username: user.username,
			Contestants: contestants,
			matches: matches,
		};
		return { success: true, stats: stats };
	}

	verifyUser(username, socket) {
		if (!this.users.findUserByUsername(username)) {
			socket.send(Main.ErrorMessage('You are not registered'));
			socket.close();
			return false;
		}
		if (Main.checkPlayer(username)) {
			socket.send(Main.ErrorMessage('You are aleady connected'));
			socket.close();
			return false;
		}
		Main.addPlayer(Main.createPlayer(username, socket));
		return true;
	}

	async closeSocket(socket) {
		if (socket.username) {
			try {
				const room = Main.getRoom(socket.gid);
				room.roomState = 'disconnected';
				room.date_at = Date.now();
			} catch (err) {
				console.error(err.message ?? 'closeSocket err');
			}
			Main.cancelAllPlayerInvitations(socket.username);
			Main.removePlayer(socket.username);
		}
	}

	async eventEntry(socket, message) {
		try {
			Main.useParser(socket.username, message);
		} catch (err) {
			socket.send(Main.ErrorMessage(err?.message ?? "you didn't pong good enough"));
			console.error('Error', err.message);
		}
	}
}

export default GameService;

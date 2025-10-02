import * as Main from '../services/game/index.js';

class GameController {
	constructor(gameService) {
		this.games = gameService;
	}

	async getUserPongSummary(req, reply) {
		const result = await this.games.getUserPongSummary(req.params?.username);
		return reply.status(200).send(result);
	}

	async getHistoryUserPong(req, reply) {
		const result = await this.games.getHistoryUserPong(req.params?.username, req.query);
		return reply.status(200).send(result);
	}

	async getHistoryUserDoom(req, reply) {
		const result = await this.games.getHistoryUserDoom(req.params?.username, req.query);
		return reply.status(200).send(result);
	}

	async getUserDoomSummary(req, reply) {
		const result = await this.games.getUserDoomSummary(req.params?.username);
		return reply.status(200).send(result);
	}

	async getLeaderBoardPong(req, reply) {
		const begin = req.query.begin;
		const end = req.query.end;
		const result = await this.games.getLeaderBoardPong(begin, end);
		return reply.status(200).send(result);
	}

	async getLeaderBoardDoom(req, reply) {
		const begin = req.query.begin;
		const end = req.query.end;
		const result = await this.games.getLeaderBoardDoom(begin, end);
		return reply.status(200).send(result);
	}

	async getTournamentsHistory(req, reply) {
		const result = await this.games.getTournamentsHistory(req.query);
		return reply.status(200).send(result);
	}

	async getTournamentsStats(req, reply) {
		const result = await this.games.getTournamentsStats(req.params?.name);
		return reply.status(200).send(result);
	}

	async pong(_, reply) {
		return reply.code(200).send({ message: 'pong' });
	}

	async game_socket(socket, req) {
		const username = req.headers['x-auth-user'];
		if (username && this.games.verifyUser(username, socket)) {
			Main.addPlayer(Main.createPlayer(username, socket, ''));
			socket.on('message', (message) => this.games.eventEntry(socket, message.toString()));
			socket.on('close', () => this.games.closeSocket(socket));
			socket.on('error', () => this.games.closeSocket(socket));
		} else {
			socket.close();
		}
	}

	async doom_socket(socket, req) {
		const username = req.headers['x-auth-user'];
		const gid = req.params?.gid;
		if (username && gid && this.games.verifyDoomUser(username, socket, gid)) {
			socket.on('message', (message) => this.games.doomEventEntry(socket, message.toString()));
			socket.on('close', () => this.games.doomCloseSocket(socket));
			socket.on('error', () => this.games.doomCloseSocket(socket));
		} else {
			socket.close();
		}
	}

	async pong_socket(socket, req) {
		const username = req.headers['x-auth-user'];
		const gid = req.params?.gid;
		if (username && gid && this.games.verifyPongUser(username, socket, gid)) {
			socket.on('message', (message) => this.games.pongEventEntry(socket, message.toString()));
			socket.on('close', () => this.games.pongCloseSocket(socket));
			socket.on('error', () => this.games.pongCloseSocket(socket));
		} else {
			socket.close();
		}
	}
}

export default GameController;

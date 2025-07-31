class GameController {
	// async getHistoryUserDoom (username)

	constructor(gameService) {
		this.games = gameService;
	}

	async getLeaderBoardPong(_req, reply) {
		const result = await this.games.getLeaderBoardPong();
		return reply.status(200).send(result);
	}

	async getUserPongSummary(req, reply) {
		const result = await this.games.getUserPongSummary(req.params?.username);
		return reply.status(200).send(result);
	}

	async getHistoryUserPong(req, reply) {
		const result = await this.games.getHistoryUserPong(req.params?.username);
		return reply.status(200).send(result);
	}

	async getHistoryUserDoom(req, reply) {
		const result = await this.games.getHistoryUserDoom(req.params?.username);
		return reply.status(200).send(result);
	}

	async getUserDoomSummary(req, reply) {
		const result = await this.games.getUserDoomSummary(req.params?.username);
		return reply.status(200).send(result);
	}

	async getLeaderBoardDoom(req, reply) {
		const result = await this.games.getLeaderBoardPong();
		return reply.status(200).send(result);
	}

	async getTournamentsHistory(req, reply) {
		const result = await this.games.getTournamentsHistory();
		return reply.status(200).send(result);
	}

	async getTournamentsStats(req, reply) {
		const result = await this.games.getTournamentsStats(req.params?.name);
		return reply.status(200).send(result);
	}

	async pong(req, reply) {
		return reply.code(200).send({ message: 'pong' });
	}
	async game_socket(connection, req) {
		void req;
		connection.on('message', (message) => this.games.eventEntry(message.toString(), connection));
		connection.on('close', () => this.games.closeSocket(connection));
		connection.on('error', () => this.games.closeSocket(connection));
	}

	// ! remove later
	async getUserProfile(req, reply) {
		const result = await this.games.getUserProfile(req.params);
		return reply.status(200).send(result);
	}
}

export default GameController;

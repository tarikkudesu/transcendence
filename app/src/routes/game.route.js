import fp from 'fastify-plugin';

import GameController from '../controllers/game.controller.js';

export default fp(async (fastify) => {
	const gameController = new GameController(fastify.gameService);

	fastify.get('/api/pong/history/:username', gameController.getHistoryUserPong.bind(gameController));
	fastify.get('/api/pong/summary/:username', gameController.getUserPongSummary.bind(gameController));
	fastify.get('/api/pong/leaderboard', gameController.getLeaderBoardPong.bind(gameController));

	fastify.get('/api/doom/history/:username', gameController.getHistoryUserDoom.bind(gameController));
	fastify.get('/api/doom/summary/:username', gameController.getUserDoomSummary.bind(gameController));
	fastify.get('/api/doom/leaderboard', gameController.getLeaderBoardDoom.bind(gameController));

	fastify.get('/api/tournament/history', gameController.getTournamentsHistory.bind(gameController));
	fastify.get('/api/tournament/:name', gameController.getTournamentsStats.bind(gameController));

	fastify.get('/api/game/ws', { websocket: true }, gameController.game_socket.bind(gameController));
	fastify.get('/api/ping', gameController.pong.bind(gameController));
});

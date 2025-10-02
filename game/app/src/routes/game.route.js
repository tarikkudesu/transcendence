import GameController from '../controllers/game.controller.js';

export const restGameRoutres = (fastify, opts) => {
	void opts;

	const gameController = new GameController(fastify.gameService);


	fastify.get('/pong/history/:username', gameController.getHistoryUserPong.bind(gameController));
	fastify.get('/pong/summary/:username', gameController.getUserPongSummary.bind(gameController));
	fastify.get('/pong/leaderboard', gameController.getLeaderBoardPong.bind(gameController));

	fastify.get('/doom/history/:username', gameController.getHistoryUserDoom.bind(gameController));
	fastify.get('/doom/summary/:username', gameController.getUserDoomSummary.bind(gameController));
	fastify.get('/doom/leaderboard', gameController.getLeaderBoardDoom.bind(gameController));

	fastify.get('/tournament/history', gameController.getTournamentsHistory.bind(gameController));
	fastify.get('/tournament/:name', gameController.getTournamentsStats.bind(gameController));
};

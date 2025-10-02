import GameController from '../controllers/game.controller.js';

export const wsGameRoutes = (fastify) => {
	const gameController = new GameController(fastify.gameService);

	fastify.get('/subscribe', { websocket: true }, gameController.game_socket.bind(gameController));
	fastify.get('/doom/:gid', { websocket: true }, gameController.doom_socket.bind(gameController));
	fastify.get('/pong/:gid', { websocket: true }, gameController.pong_socket.bind(gameController));
};

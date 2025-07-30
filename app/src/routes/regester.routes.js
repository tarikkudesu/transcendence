import gameRoute from './game.route.js';
import fp from 'fastify-plugin';

export default fp((fastify) => {
	fastify.register(gameRoute);
});

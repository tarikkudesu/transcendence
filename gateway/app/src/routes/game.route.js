import { config } from '../config/env.config.js';

export const game = async (fastify) => {
	const forward = (request, reply) => {
		try {
			reply.from(`${config.servers.GAME}${request.url}`, {
				rewriteRequestHeaders: (request, headers) => {
					return {
						...headers,
						'X-Request-Origin': fastify.internalToken('user'),
					};
				},
				body: request.body,
			});
		} catch (error) {
			console.log(error);
			reply.status(503).send({ error: `Service unavailable` });
		}
	};

	fastify.addHook('onRequest', async (request, reply) => {
		await fastify.authenticate(request, reply);
	});

	fastify.get('/pong/history/:username', forward);
	fastify.get('/pong/summary/:username', forward);
	fastify.get('/pong/leaderboard', forward);

	fastify.get('/doom/history/:username', forward);
	fastify.get('/doom/summary/:username', forward);
	fastify.get('/doom/leaderboard', forward);

	fastify.get('/tournament/history', forward);
	fastify.get('/tournament/:name', forward);
};

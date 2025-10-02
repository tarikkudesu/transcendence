import { config } from '../config/env.config.js';

export class AuthController {
	constructor(fastify) {
		this.fastify = fastify;
	}

	forward (request, reply) {
		try {
			reply.from(`${config.servers.AUTH}${request.url}`, {
				rewriteRequestHeaders: (request, headers) => {
					return {
						...headers,
						'X-Request-Origin': this.fastify.internalToken('user'),
					};
				},
				body: request.body
			});
		} catch (error) {
			console.log(error);
			reply.status(503).send({ error: 'Service unavailable' });
		}
	}

	async check(req, reply) {
		await this.fastify.authenticate(req, reply);
		reply.header('x-auth-user', req.user.username);
		reply.send({ success: true });
	}

	async me(req, reply) {
		await this.fastify.authenticate(req, reply);
		reply.header('x-auth-user', req.user.username);
		reply.send(req.user);
	}
}

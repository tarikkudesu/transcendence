import Fastify from 'fastify';
import env from 'dotenv';

class Server {
	constructor(logger = true) {
		/**
		 * fastify instance
		 */
		this.fastify = Fastify({ logger });
	}

	async registerPlugins() {
		/**
		 * the order of the layers is important, due to its architecture nature.
		 * dao layer used by service leyer which is used by the controller
		 */

		this.fastify.register(await import('./hooks/index.js'));
		this.fastify.register(await import('./repositories/index.js'));
		this.fastify.register(await import('./services/index.js'));
		this.fastify.register(await import('./routes/index.js'));
	}

	async listen() {
		this.fastify.listen({
			port: 3000,
			host: '0.0.0.0',
		});
	}

	async start() {
		/**
		 * load the environnement vars from .env
		 */
		env.config({ path: './.env' });

		await this.registerPlugins();
		await this.listen();
	}
}

export { Server };

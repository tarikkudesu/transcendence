import { config } from './src/config/env.config.js';
import fastify from './src/server.js';

fastify.listen(
	{
		port: config.port,
		host: config.host,
	},

	(err, address) => {
		if (err) {
			process.exit(1);
		}
		console.log(`fastify server is running on ${address}...`);
	}
);

import Fastify from "fastify";
import { config } from "./config/env.config.js";
import plugins from './plugins/regester.plugins.js'
import { restGameRoutres } from './routes/game.route.js'
import { wsGameRoutes } from './routes/ws.game.route.js'
import cors from "@fastify/cors";

export class Server {
	constructor() {
		this.server = Fastify({ exposeHeadRoutes: false });
		this.config();
	}

	config() {
		this.server.register(cors, {
			origin: config.domain,
			credentials: true,
			methods: config.methods?.split(',')
		});
		this.server.setErrorHandler((error, request, reply) => {
            return reply.send(error);
        });
		this.server.register(plugins);
		this.server.register(restGameRoutres, { prefix: "/api/v1/game" });
		this.server.register(wsGameRoutes, { prefix: "/ws/v1/game" });
	}

	start()
	{
		this.server.listen({
			port: config.port,
			host: config.host,
		})
		.then(address => console.log(`game server is running on ${address}...`))
		.catch(err => {
			console.error(err);
			process.exit(1);
		})
	}
}

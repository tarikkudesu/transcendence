import Fastify from "fastify";
import plugins from "./plugins/index.plugin.js";
import { routes } from "./routes/index.route.js";
import { internal } from "./routes/internal.route.js";
import { config } from "./config/env.config.js";
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
			if (error.validation) {
				const message = error.validation[0].message;
                return reply.status(400).send({
					statusCode: 400,
                    error: "Bad Request",
                    message,
                });
            }
			if (error.statusCode === 303)
				reply.send({...error, statusCode: 200});
			return reply.send(error);
        });
		this.server.register(plugins);
		this.server.register(routes, { prefix: "/api/v1/auth" });
		this.server.register(internal, { prefix: "/internal" });
	}

	start()
	{
		this.server.listen({
			port: config.port,
			host: config.host,
		})
		.then(address => console.log(`auth server is running on ${address}...`))
		.catch(err => {
			console.error(err);
			process.exit(1);
		})
	}
}

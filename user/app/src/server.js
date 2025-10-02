import Fastify from "fastify";
import { config } from "./config/env.config.js";
import registerPlugins from "./plugins/regester.plugins.js";
import registerRoutes from "./routes/regester.routes.js";
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
      if (error.statusCode === 303) reply.send({ ...error, statusCode: 200 });
      return reply.send(error);
    });

    this.server.register(registerPlugins);
    this.server.register(registerRoutes);
  }

  start() {
	  this.server.listen({
		  port: config.port,
		  host: config.host,
	  })
	  .then(address => console.log(`user server is running on ${address}...`))
	  .catch(err => {
		  console.error(err);
		  process.exit(1);
	  })
  }
}

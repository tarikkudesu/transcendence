import Fastify from 'fastify'
import plugins from './plugins/index.plugin.js'
import { chat } from './routes/chat.route.js'
import { config } from './config/env.config.js';

export class Server
{
    constructor()
    {
        this.server = Fastify({ exposeHeadRoutes: false });
        this.config();
    }

    config()
    {
		this.server.setErrorHandler((error, request, reply) => {
			if (error.validation) {
				const message = error.validation[0].message;
                return reply.status(400).send({
					statusCode: 400,
                    error: "Bad Request",
                    message,
                });
            }
            return reply.send(error);
        });
        this.server.register(plugins);
        this.server.register(chat, { prefix: '/ws/v1/chat' });
    }

    start()
    {
        this.server.listen({
            port: config.port,
            host: config.host,
        })
        .then(address => console.log(`chat server is running on ${address}...`))
        .catch(err => {
            console.error(err);
            process.exit(1);
        })
    }
}

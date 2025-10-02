import Fastify from 'fastify'
import plugins from './plugins/index.plugin.js'
import { config } from './config/env.config.js';
import { routes } from './routes/notification.route.js';


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
			if (error.statusCode === 303) {
				reply.send({...error, statusCode: 200});
			}
            return reply.send(error);
        });
        this.server.register(plugins);
        this.server.register(routes, { prefix: '/ws/v1/notification' });
    }

    start()
    {
        this.server.listen({
            port: config.port,
            host: config.host,
        })
        .then(address => console.log(`notification server is running on ${address}...`))
        .catch(err => {
            console.error(err);
            process.exit(1);
        })
    }
}

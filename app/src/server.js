import Fastify from 'fastify';
import registerPlugins from './plugins/regester.plugins.js';
import registerRoutes from './routes/regester.routes.js';
import printRoutes from 'fastify-print-routes';
import setupUserConsumers from './mq/user.consumer.js';

const fastify = Fastify();

fastify.register(printRoutes);
await fastify.register(registerPlugins);
await fastify.register(registerRoutes);
await setupUserConsumers (fastify);

export default fastify;

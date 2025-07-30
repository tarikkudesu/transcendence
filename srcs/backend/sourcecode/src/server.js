import Fastify from 'fastify';
import registerPlugins from './plugins/regester.plugins.js';
import registerRoutes from './routes/regester.routes.js';

const fastify = Fastify({ logger: true });
await fastify.register(registerPlugins);
await fastify.register(registerRoutes);

export default fastify;

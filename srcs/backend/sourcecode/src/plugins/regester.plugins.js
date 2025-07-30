import fp from 'fastify-plugin';
import jwtPlugin from './jwt.plugin.js'
import dbplugin from './sqlite-db.plugins.js'
import mailerPlugin from './mailer.plugin.js';
import googleAuthPlugin from './google-auth.plugin.js';
import fastifyMultipart from '@fastify/multipart';
import redisPlugin from './redis.plugin.js';

export default fp 
(
    async function registerPlugins (fastify)
    {
		await fastify.register(await import('@fastify/websocket'));
        await fastify.register (dbplugin);
        await fastify.register (redisPlugin);
        await  fastify.register (jwtPlugin);
        await fastify.register (mailerPlugin);
        await fastify.register (googleAuthPlugin);

        await fastify.register (fastifyMultipart, 
        {
            limits: { fileSize: 4_000_000 },
            attachFieldsToBody: true,
            throwFileSizeLimit: false,
        });
    }
)
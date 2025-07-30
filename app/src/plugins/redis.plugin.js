import RedisStore from 'recacheman-redis';
import fp from 'fastify-plugin';
import fastifyCacheman from 'fastify-cacheman';
import { config } from '../config/env.config.js';

export default fp(async (fastify) => {
    const redisStore = new RedisStore(config.servers.redis);

    await fastify.register(fastifyCacheman, {
        namespace: 'auth',
        engine: redisStore
    });

    if (!fastify.cacheman) {
        console.log('fastify.cacheman is undefined');
    } else {
        console.log('fastify.cacheman is ready');
    }

    fastify.decorate('cache', fastify.cacheman);
});

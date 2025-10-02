import RedisStore from 'recacheman-redis';
import fp from 'fastify-plugin';
import fastifyCacheman from 'fastify-cacheman';
import { config } from '../config/env.config.js';

export default fp(async (fastify) => {
    let redisAvailable = false;
    let redisStore;
    try {
        redisStore = new RedisStore(config.servers.redis);

        redisStore.client.on('connect', () => {
            redisAvailable = true;
        });
        redisStore.client.on('error', () => {
            redisAvailable = false;
        });

        await fastify.register(fastifyCacheman, {
            namespace: 'auth',
            engine: redisStore
        });

    } catch (err) {
        console.error('[Redis] Failed to initialize store:', err.message);
    }
    const cache = {
        async get(key) {
            try {
                if (!redisAvailable)
                    return null;
                return await fastify.cacheman.get(key);
            } catch (err) {
				console.log(err);
                return null;
            }
        },
        async set(key, value, ttl) {
            try {
                if (!redisAvailable)
                    return null;
                await fastify.cacheman.set(key, value, ttl);
            } catch (err) {
				console.log(err);
            }
        },
        async del(key) {
            try {
                if (!redisAvailable)
                    return null;
                await fastify.cacheman.del(key);
            } catch (err) {
				console.log(err);
            }
        }
    };

    fastify.decorate('cache', cache);
});

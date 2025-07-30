import { createClient } from 'redis';
import fs from 'fastify-plugin';
import fastifyCacheman from 'fastify-cacheman';
import { config } from '../config/env.config.js';

export default fs 
(
    async (fastify) => 
    {
        const redisClient = createClient (
            {
                url : config.redis_url,
                legacyMode: true,
            });

        redisClient.on ('error', (err) => 
        {
            console.error('redis erroXXXX', err);
        })
        // this part fot test --------------------------
        // try 
        // {
        //     await redisClient.connect 
        //      const ping = await redisClient.ping();
        //       if (ping === 'PONG')
        //         console.log('✅ Redis client connected successfully');
        // }
        // catch (err)
        // {
        //     console.error ('❌ redis  is failed', err);
        // }
        // ---------------------------------------------
        await fastify.register (fastifyCacheman,
            {
                namespace : 'auth',
                engine: 'redis',
                client : redisClient
            })
        fastify.decorate ('cache', fastify.cacheman);
    }
)
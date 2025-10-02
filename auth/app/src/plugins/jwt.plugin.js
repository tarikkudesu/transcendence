import { config } from '../config/env.config.js'
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import AppError from '../utils/AppError.js';

export default fp(
    async (fastify) => {
        await fastify.register(fastifyJwt,
            {
                secret: config.jwt_secret,
                cookie:
                {
                    cookieName: 'AccessToken',
                }
            });

        fastify.decorate('authenticate', async (req, reply) => {
            try {
                await req.jwtVerify();
            }
            catch (err) {
                if (err.code === 'FST_JWT_NO_AUTHORIZATION_IN_COOKIE')
                    throw new AppError('You are not logged in. Please login first.', 401);
                if (err.code === 'FST_JWT_INVALID_TOKEN')
                    throw new AppError('Invalid or expired token. Please login again.', 401);
                return reply.status(400).send(err);
            }
        });
    }
);

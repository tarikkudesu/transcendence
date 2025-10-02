import fp from 'fastify-plugin';
import mailer from 'fastify-mailer';
import { config } from '../config/env.config.js';

export default fp ( async (fastify) => {
    fastify.register (mailer, {
        defaults : {
            from : `Ping Pong ${config.mailer.email}`
        },
        transport : {
            host : config.mailer.host,
            port : 587,
            secure : false,
            auth : {
                user : config.mailer.email,
                pass : config.mailer.password,
            }
        }
    });
})

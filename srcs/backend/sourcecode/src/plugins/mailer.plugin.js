import fp from 'fastify-plugin';
import mailer from 'fastify-mailer';
import { config } from '../config/env.config.js';

export default fp 
(
    async (fastify) => 
    {
        fastify.register (mailer, 
        {
            defaults : 
            {
                from : 'Mestapha zahiri oz22wac@gmail.com',
                subject : 'default example',
            },
            transport : 
            {
                host : config.email_host,
                port : 587,
                secure : false,
                auth : 
                {
                    user : config.email_user,
                    pass : config.email_password,
                }
            }
        });
    }
)
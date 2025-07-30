import fp from "fastify-plugin";
import fastifyOauth2 from "@fastify/oauth2";
import { config } from "../config/env.config.js";

export default fp
(
    async (fastify) => 
    {

        await fastify.register (fastifyOauth2, 
            {
                name : 'googleOauth2',
                scope : ['profile', 'email'],
                credentials :
                {
                    client :
                    {
                        id : config.client_id,
                        secret : config.client_secret,
                    },
            },

            discovery: {
            issuer: 'https://accounts.google.com'
            },
            startRedirectPath: '/auth/google',
            callbackUri : config.redirect_uri,
            callbackUriParams : 
            {
                access_type : 'offline',
            },
            pkce : 'S256',
    })
    }
);

import { config } from './src/config/env.config.js';
import fastify  from "./src/server.js";


fastify.listen 
(
    {
        port: config.port,
		host: '0.0.0.0',
    },

    (err, address) => 
    {
        if (err) 
        {
            process.exit(1);
        }
        console.log(`server is running in ${address}`)
    }
)

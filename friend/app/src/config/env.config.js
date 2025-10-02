const config = 
{

    port : process.env.PORT || 3006,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'dev',
    methods: process.env.ALLOWED_METHODS,
    domain: process.env.DOMAIN_NAME || 'https://localhost',
    db: process.env.DB_PATH || '/app/src/data/friend.sqlite',
    
    friend_queue: process.env.FRIEND_QUEUE,
    notification_queue: process.env.NOTIF_QUEUE,

    servers: {
        rabbitmq : process.env.RABBITMQ_HOST || 'amqp://localhost',
    }
}

export {config};
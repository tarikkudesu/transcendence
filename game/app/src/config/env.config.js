
const config = 
{
    port : process.env.PORT || 3004,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'dev',
    methods: process.env.ALLOWED_METHODS,
    domain: process.env.DOMAIN_NAME || 'https://localhost',
    db: process.env.DB_PATH || '/app/src/data/game.sqlite',

    notification_queue: process.env.NOTIF_QUEUE,
    friend_queue: process.env.FRIEND_QUEUE,

    servers: {
        rabbitmq : process.env.RABBITMQ_HOST || 'amqp://localhost',
        redis : process.env.REDIS_HOST || 'redis://localhost',
    },
}

export { config };

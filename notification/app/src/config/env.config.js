const config = 
{
    port : process.env.PORT || 3005,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'dev',
    methods: process.env.ALLOWED_METHODS,
    domain: process.env.DOMAIN_NAME || 'https://localhost',
    
    db: process.env.DB_PATH || '/app/src/data/notification.sqlite',
    notification_queue: process.env.NOTIF_QUEUE || 'notification_queue',

    mailer: {
        email: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
        host: process.env.EMAIL_HOST,
    },

    servers: {
        rabbitmq : process.env.RABBITMQ_HOST || 'amqp://localhost',
        redis : process.env.REDIS_HOST || 'redis://localhost'
    }
}

export {config};

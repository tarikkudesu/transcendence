
const config = 
{
    host: process.env.HOST || '0.0.0.0',
    port : process.env.PORT || 3004,
    db_path : process.env.DB_PATH,

    servers: {
        rabbitmq : process.env.RABBITMQ_HOST || 'amqp://localhost',
        redis : process.env.REDIS_HOST || 'redis://localhost',
    },
}

export { config };

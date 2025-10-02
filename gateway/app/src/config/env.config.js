export const config = {
    port: process.env.PORT || 4000,
    host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'dev',
    methods: process.env.ALLOWED_METHODS,
    domain: process.env.DOMAIN_NAME || 'https://localhost,',
    JWT_SECRET : process.env.JWT_SECRET || 'no_secret_for_dev',
    servers :
    {
        RABBITMQ : process.env.RABBITMQ_HOST || 'amqp://localhost',
        REDIS : process.env.REDIS_HOST || 'redis://localhost',
        GATEWAY : process.env.GATEWAY_HOST || 'http://localhost:3000',
        GAME : process.env.GAME_HOST || 'http://localhost:3004',
        AUTH : process.env.AUTH_HOST || 'http://localhost:3001',
        FRIEND : process.env.FRIEND_HOST || 'http://localhost:3006',
        USER : process.env.USER_HOST || 'http://localhost:3002',
    },
}

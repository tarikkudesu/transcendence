const config = {
    port : process.env.PORT || 3002,
	host: process.env.HOST || '0.0.0.0',
    env: process.env.NODE_ENV || 'dev',
    methods: process.env.ALLOWED_METHODS,
    domain: process.env.DOMAIN_NAME || 'https://localhost',

    db: process.env.DB_PATH || '/app/src/db/users.sqlite',
    cloudinary_name : process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_key : process.env.CLOUDINARY_API_KEY,
    cloudinary_secret : process.env.CLOUDINARY_API_SECRET,

    servers: {
        rabbitmq : process.env.RABBITMQ_HOST || 'amqp://localhost',
        auth : process.env.AUTH_HOST || 'http://auth:3001',
    },
}

export {config};

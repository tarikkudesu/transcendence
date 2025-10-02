export const config = {
  port: process.env.PORT || 3001,
  host: process.env.HOST || "0.0.0.0",
  env: process.env.NODE_ENV || "dev",
  methods: process.env.ALLOWED_METHODS,
  domain: process.env.DOMAIN_NAME || "https://localhost,",

  jwt_secret: process.env.JWT_SECRET || "NO_SECRET_IN_DEV",

  redirect_uri: process.env.REDIRECT_URI,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,

  notification_queue: process.env.NOTIF_QUEUE,

  servers: {
    redis: process.env.REDIS_HOST || "redis://localhost",
    user: process.env.USER_HOST || "http://localhost:3002",
    rabbitmq: process.env.RABBITMQ_HOST || "amqp://localhost",
  },
};

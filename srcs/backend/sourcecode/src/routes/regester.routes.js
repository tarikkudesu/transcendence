import googleAuthRoute from './google-auth.route.js';
import authRoutes from './auth.route.js';
import userRoute from './user.route.js';
import gameRoute from './game.route.js';
import fp from 'fastify-plugin';

export default fp((fastify) => {
	fastify.register(authRoutes);
	fastify.register(userRoute);
	fastify.register(gameRoute);
	fastify.register(googleAuthRoute);
});

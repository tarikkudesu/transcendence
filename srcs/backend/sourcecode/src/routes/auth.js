import * as schemas from '../schemas/auth.js';
import * as authController from '../controllers/auth-controller.js';

export const pong = async (request, reply) => {
	return reply.code(200).send({ message: 'pong' });
};

export const pang = async (request, reply) => {
	return reply.code(200).send({ message: 'pang' });
};

export default (fastify) => {
	fastify.post('/refresh', authController.refreshToken);

	fastify.post('/signin', { schema: schemas.signinSchema }, authController.signin);

	fastify.post('/signup', { schema: schemas.signupSchema }, authController.signup);

	fastify.post('/logout', { schema: schemas.logoutSchema }, authController.logout);

	fastify.post('/password/get-otp', authController.getOtp);

	fastify.post('/password/verify-otp', authController.verifyOtp);

	fastify.get('/ping', pong);

	fastify.get('/pang', pang);

	fastify.options('*', authController.preflight);
};

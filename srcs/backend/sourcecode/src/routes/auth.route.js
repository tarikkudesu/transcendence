import fp from 'fastify-plugin';

import AuthService from '../services/auth.service.js';
import AuthController from '../controllers/auth.controller.js';
import UserRepository from '../repository/user.repository.js';
import {
	signupSchema,
	loginSchema,
	resetPasswordSchema,
	emailSchema,
	codeSchema,
	complitProfileSchema,
} from '../schemas/auth.schema.js';

export default fp(async (fastify, opts) => {
	const userRopo = new UserRepository(fastify.db);
	const authService = new AuthService(userRopo, fastify);
	const authController = new AuthController(authService);

	fastify.post('/auth/refresh', authController.refreshToken.bind(authController));
	fastify.post('/signup', authController.signup.bind(authController));
	fastify.post('/login', { schema: loginSchema }, authController.login.bind(authController));
	fastify.post('/logout', authController.logout.bind(authController));

	fastify.post('/forgot-password', { schema: emailSchema }, authController.forgotPassword.bind(authController));
	fastify.post('/reset-password', { schema: resetPasswordSchema }, authController.resetPassword.bind(authController));

	fastify.post('/verify-user', { schema: codeSchema }, authController.verifyUser.bind(authController));
	fastify.post('/resend-code', { schema: emailSchema }, authController.sendMail.bind(authController));

	fastify.post(
		'/complite-profile/:username',
		{ schema: complitProfileSchema },
		authController.completeProfile.bind(authController)
	);
});

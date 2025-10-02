import { AuthController } from '../controllers/auth.controller.js';
import * as schemas from '../schemas/auth.schema.js';

export const auth = async (fastify) => {

    const authController = new AuthController (fastify);

    fastify.post('/refresh', authController.forward.bind (authController));
    fastify.post('/signup', { schema: schemas.signupSchema }, authController.forward.bind(authController));
    fastify.post('/login', { schema: schemas.loginSchema }, authController.forward.bind(authController));
    fastify.post('/logout', authController.forward.bind(authController));

    fastify.post('/forgot-password', { schema: schemas.emailSchema }, authController.forward.bind(authController));
    fastify.post ('/reset-password', {
        schema: schemas.resetPasswordSchema
    }, authController.forward.bind (authController));

    fastify.post('/verify-user', { schema: schemas.codeSchema }, authController.forward.bind(authController));
    fastify.post('/resend-otp', authController.forward.bind(authController));

    fastify.post ('/verify-2fa', { schema: schemas.codeSchema }, authController.forward.bind(authController));
    
    fastify.get('/callback', authController.forward.bind(authController));
    fastify.get('/google', authController.forward.bind(authController));

    fastify.get('/check', authController.check.bind(authController))
    fastify.get('/me', authController.me.bind(authController))
}

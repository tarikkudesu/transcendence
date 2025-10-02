import AuthController from '../controllers/auth.controller.js'
import GoogleAuthController from '../controllers/google-auth.controller.js'
import AuthService from '../services/auth.service.js'
import { UserRepository  } from '../repositories/user.repository.js'
import GoogleAuthService from '../services/google-auth.service.js'
export const routes = async (fastify) => {

    const userRepo =  new UserRepository  (fastify.db);
    const authService = new AuthService(userRepo, fastify);
    const authController = new AuthController(authService);

    const googleAuthService  = new GoogleAuthService(fastify, userRepo);
    const googleAuthController = new GoogleAuthController(googleAuthService);

    fastify.post ('/refresh', authController.refreshToken.bind (authController))
    fastify.post ('/signup' ,authController.signup.bind (authController))
    fastify.post ('/login', authController.login.bind (authController));
    fastify.post ('/logout', authController.logout.bind (authController));

    fastify.post ('/forgot-password', authController.forgotPassword.bind (authController));
    fastify.post ('/reset-password', authController.resetPassword.bind (authController));

    fastify.post ('/verify-user', authController.verifyUser.bind (authController));
    fastify.post ('/resend-otp', authController.sendMail.bind (authController));

    fastify.post ('/verify-2fa', authController.verifyTwoFa.bind (authController));

    fastify.get ('/callback', googleAuthController.googleCallback.bind (googleAuthController));
	
    fastify.get('/ping', (req, res) => {
        res.status(204).send();
    });
}

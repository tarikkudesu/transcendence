import AuthController from '../controllers/auth.controller.js'
import AuthService from '../services/auth.service.js'
import { UserRepository  } from '../repositories/user.repository.js'

export const internal = async (fastify) =>
{
    const userRepo =  new UserRepository  (fastify.db);
    const authService = new AuthService(userRepo, fastify);
    const authController = new AuthController(authService);

    fastify.post('/token/regenerate', authController.regenerate.bind(authController));
}

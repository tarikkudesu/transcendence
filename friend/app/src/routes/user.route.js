import { UserController } from "../controllers/user.controller.js"
import { UserService } from "../services/user.service.js"
import { UserRepository } from "../repositories/user.repository.js"

export const users = ( fastify ) =>
{
    const userRepo = new UserRepository(fastify.db);
    const userService = new UserService(userRepo);
    const userController = new UserController(fastify, userService);

    fastify.get('/:keyword', userController.getUsersByKeyword.bind(userController));
}

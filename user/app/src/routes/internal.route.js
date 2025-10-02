import UserService from '../services/user.service.js';
import UserController from '../controllers/user.controller.js';
import UserRepository from '../repository/user.repository.js';

export default  async (fastify) => 
{
    const userRopo = new UserRepository(fastify.db)
    const userService = new UserService (userRopo, fastify);
    const userController = new UserController(userService);

    fastify.post ('/', userController.createUser.bind (userController));
    fastify.post ('/avatar', userController.updateAvatarurl.bind (userController));
    fastify.get('/email/:email', userController.findUserByEmail.bind (userController));
    fastify.get ('/username/:username', userController.findUserByUsername.bind (userController));
    fastify.put ('/state', userController.verifyUser.bind (userController));
    fastify.get ('/usernames', userController.findAllUsernames.bind (userController));
}



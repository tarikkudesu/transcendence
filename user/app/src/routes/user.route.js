
import UserService from '../services/user.service.js';
import UserController from '../controllers/user.controller.js';
import UserRepository from '../repository/user.repository.js';

export default (fastify) => 
{
    const userRopo = new UserRepository(fastify.db)
    const userService = new UserService (userRopo, fastify);
    const userController = new UserController(userService);

    fastify.get ('/:username' , userController.getUserProfile.bind (userController));
    fastify.get ('/me' , userController.getMyProfile.bind (userController));

    fastify.put ('/profile/username',userController.updateUsername.bind (userController));
    fastify.put ('/profile/bio',userController.updateBio.bind (userController));
    fastify.put ('/profile/password', userController.updataPassword.bind (userController));
    fastify.put ('/profile/avatar' , userController.uploadUpdatedAvatar.bind (userController));

    // fastify.post ('/reset-password', userController.resetPassword.bind (userController));

    fastify.put('/2fa', userController.activateTwoFa.bind (userController));

    fastify.delete ('/', userController.deleteAccount.bind (userController));
}

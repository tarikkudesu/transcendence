
import fp from 'fastify-plugin';
import {updateUsernameBioSchema, updatePasswordSchema , updataAvatarSchema} from  '../schemas/user.schema.js'
import UserService from '../services/user.service.js';
import UserController from '../controllers/user.controller.js';
import UserRepository from '../repository/user.repository.js';

export default fp
(
    async (fastify) => 
        {
            const userRopo = new UserRepository(fastify.db)
            const userService = new UserService (userRopo, fastify);
            const userController = new UserController(userService);
    
            fastify.get ('/me/profile/:username' ,{onRequest: [fastify.authenticate]}, userController.getUserProfile.bind (userController));
            
            fastify.put ("/me/profile/update/avatar/:username" ,{
                onRequest: [fastify.authenticate],
                schema : updataAvatarSchema,
            } , userController.updateAvatar.bind (userController));

            fastify.put ('/me/profile/update/username-bio/:username', 
            {
                onRequest: [fastify.authenticate],
                schema : updateUsernameBioSchema,
            },
            userController.updateUsernameBio.bind (userController));
            
            fastify.put ('/me/profile/update/password/:username',
            {
                schema : updatePasswordSchema,
                onRequest: [fastify.authenticate]
            }
            , userController.updataPassword.bind (userController));
        }
)






















































































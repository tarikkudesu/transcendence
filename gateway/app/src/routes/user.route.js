import * as schemas from '../schemas/user.schema.js'
import { UserController } from '../controllers/user.controller.js'

export const user = async (fastify) => {
    const userController = new UserController(fastify);

    fastify.get ('/me' ,{onRequest: [fastify.authenticate]}, userController.getUserProfile.bind (userController));

    fastify.get ('/:username' ,{onRequest: [fastify.authenticate]}, userController.getUserProfile.bind (userController));

    fastify.put ("/profile/avatar", {
            onRequest: [fastify.authenticate],
            schema : schemas.updataAvatarSchema,
        },
        userController.updateAvatar.bind (userController)
    );

    fastify.put ('/profile/bio', {
            onRequest: [fastify.authenticate],
            schema : schemas.updateBioSchema,
        },
        userController.updateBio.bind (userController)
    );

    fastify.put ('/profile/username', {
            onRequest: [fastify.authenticate],
            schema : schemas.updateUsernameSchema,
        },
        userController.updateUsername.bind (userController)
    );

    fastify.put ('/profile/password', {
            schema : schemas.updatePasswordSchema,
            onRequest: [fastify.authenticate]
        },
        userController.updataPassword.bind (userController)
    );

    fastify.put ('/2fa', {
            onRequest: [fastify.authenticate]
        },
        userController.forward.bind(userController)
    );

    fastify.delete('/', {
            onRequest: [fastify.authenticate],
        },
        userController.forward.bind(userController)
    );
}

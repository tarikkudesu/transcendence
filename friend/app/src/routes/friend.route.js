import { FriendService } from "../services/friend.service.js"
import { FriendController } from "../controllers/friend.controller.js"
import { FriendRepository } from "../repositories/friend.repository.js"
import { UserService } from "../services/user.service.js"
import { UserRepository } from "../repositories/user.repository.js"

export const friend = ( fastify ) =>
{
    const userRepo = new UserRepository(fastify.db)
    const userService = new UserService(userRepo)
    const friendRepository = new FriendRepository(fastify.db)
    const friendService = new FriendService(fastify, friendRepository, userService);
    const friendController = new FriendController(friendService)

    fastify.get('/', friendController.allFriends.bind(friendController));
    fastify.get('/blocked', friendController.blocked.bind(friendController));
    fastify.get('/request', friendController.request.bind(friendController));
    fastify.post('/add', friendController.addFriend.bind(friendController));
    fastify.post('/check', friendController.check.bind(friendController));
    fastify.put('/accept', friendController.acceptFriend.bind(friendController));
    fastify.put('/block', friendController.blockFriend.bind(friendController));
    fastify.delete('/remove', friendController.removeFriend.bind(friendController));
}

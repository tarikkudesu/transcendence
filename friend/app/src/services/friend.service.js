import { friendPublisher } from "../mq/friend.publisher.js";
import { notificationPublisher } from "../mq/notification.publisher.js";
import AppError from "../utils/AppError.js";
export class FriendService
{
    constructor(fastify, friendRepository, userService)
    {
        this.fastify = fastify
        this.friendRepository = friendRepository
        this.userService = userService
    }

    getAllFriends(from, { begin, end })
    {
        return this.friendRepository.findAllFriends(from, begin, end);
    }

    getBlocked(from, { begin, end })
    {
        return this.friendRepository.findBlocked(from, begin, end);
    }

    getRequest(from, { begin, end })
    {
        return this.friendRepository.findRequest(from, begin, end);
    }

    getFriendship({ from, to })
    {
        return this.friendRepository.findOne(from, to);
    }

    check({ from, to })
    {
        const friendship = this.friendRepository.findOne(from, to);
		if (!friendship) return { state: "none" }
        return { state: friendship.stat }
    }

    async addFriend(friend)
    {
        if (friend.u_from === friend.u_to)
            throw new AppError(`you can not add yourself`, 400);
        const friendship = this.friendRepository.findOne(friend.u_from, friend.u_to)
        if (friendship) {
            if (friendship.stat == 'pending')
                throw new AppError(`you alreay add this user`, 400);
            if (friendship.stat == 'accepted')
                throw new AppError(`you are already friends`, 400);
            if (friendship.stat == 'blocked')
                throw new AppError(`this user blocked you`, 400);
        }
        friend.stat = 'pending';
        this.friendRepository.insert(friend)
        const userFrom = this.userService.getUserByUsername(friend.u_from);
        const userTo = this.userService.getUserByUsername(friend.u_to)
        await notificationPublisher (this.fastify, {
            service: 'friend',
            event: 'FRIENDREQUEST',
            sender: userFrom?.username,
            receiver: userTo?.username,
            date: Date.now(),
        });
    }

    async acceptFriend(friend)
    {
        const userFrom = this.userService.getUserByUsername(friend.u_from);
        const userTo = this.userService.getUserByUsername(friend.u_to);
        const friendship = this.friendRepository.findOne(friend.u_from, friend.u_to)
        if (!friendship)
            throw new AppError(`that user did not send to you a friend request`, 400);
        if (friendship?.stat == 'blocked')
            throw new AppError(`this user blocked you`, 400);
        if (friendship?.stat == 'accepted')
            throw new AppError(`you are already friends`, 400);
        friend.stat = 'accepted'
        this.friendRepository.update(friend);
        await notificationPublisher (this.fastify, {
            service: 'friend',
            event: 'FRIENDACCEPTEDYOURREQUEST',
            sender: userFrom?.username,
            receiver: userTo?.username,
            date: Date.now(),
        });
        await friendPublisher (this.fastify, {
            type : 'CREATE_FRIEND',
            u_from: userFrom?.username,
            u_to: userTo?.username,
        });
    }

    async blockFriend(friend)
    {
        const friendship = this.friendRepository.findOne(friend.u_from, friend.u_to)
        if (!friendship)
            throw new AppError(`you are not friends`, 400);
        if (friendship.stat !== 'accepted')
            throw new AppError(`you cannot block this user`, 400);
        friend.stat = 'blocked'
        this.friendRepository.update(friend);
        const userTo = this.userService.getUserByUsername(friend.u_to);
        const userFrom = this.userService.getUserByUsername(friend.u_from);
        await friendPublisher (this.fastify, {
            type : 'DELETE_FRIEND',
            u_from: userFrom.username,
            u_to: userTo.username,
        });
    }

    async removeFriend(friend)
    {
        const friendship = this.friendRepository.findOne(friend.u_from, friend.u_to)
        if (!friendship)
            throw new AppError(`you are not friends`, 400);
        if (friendship.stat === 'accepted')
            throw new AppError(`you can not remove accepted friend (block it :D)`, 400);
        this.friendRepository.delete(friend.u_from, friend.u_to)
        const userTo = this.userService.getUserByUsername(friend.u_to);
        const userFrom = this.userService.getUserByUsername(friend.u_from)
        await friendPublisher (this.fastify, {
            type : 'DELETE_FRIEND',
            u_from: userFrom.username,
            u_to: userTo.username,
        });
    }
}

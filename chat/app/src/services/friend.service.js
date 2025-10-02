export class FriendService
{
    constructor(fastify, friendRepository)
    {
        this.fastify = fastify
        this.friendRepository = friendRepository
    }

    getAll(from)
    {
        return this.friendRepository.findAllFriends(from);
    }

    async getUserByUsername(username)
    {
        return await this.friendRepository.getUserByUsername(username);
    }

    async isFriend(from, to)
    {
        const friendship = await this.friendRepository.findFriendShip(from, to);
        return friendship && friendship.stat === 'accepted'; 
    }
}

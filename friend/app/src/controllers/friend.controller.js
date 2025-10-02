export class FriendController
{
    constructor(friendService)
    {
        this.friendService = friendService;
    }

    allFriends(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const friends = this.friendService.getAllFriends(from, request.query);
        reply.send(friends)
    }

    blocked(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const friends = this.friendService.getBlocked(from, request.query);
        reply.send(friends)
    }

    request(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const friends = this.friendService.getRequest(from, request.query);
        reply.send(friends)
    }

    friendship(request, reply)
    {
        const to = request.query.to;
        const from = request.query.from;
        const friend = this.friendService.getFriendship({from, to});
        reply.send({ friend });
    }

    async check(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const to = request.body.to;
        const result = this.friendService.check({ from, to });
        reply.send(result)
    }

    async addFriend(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const to = request.body.to;
        await this.friendService.addFriend({
            u_from: from,
            u_to: to
        })
        reply.send({ message: 'added successfully' })
    }

    async acceptFriend(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const to = request.body.to;
        await this.friendService.acceptFriend({
            u_from: from,
            u_to: to
        })
        reply.send({ message: 'accepted successfully' })
    }

    async blockFriend(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const to = request.body.to;
        await this.friendService.blockFriend({
            u_from: from,
            u_to: to
        })
        reply.send({ message: 'blocked successfully' })
    }

    async removeFriend(request, reply)
    {
        const from = request.headers['x-auth-user'];
        const to = request.body.to;
        await this.friendService.removeFriend({
            u_from: from,
            u_to: to
        })
        reply.send({ message: 'removed successfully' })
    }
}

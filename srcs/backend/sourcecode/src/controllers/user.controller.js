import fastify from "fastify";

class UserController
{
    constructor (userService)
    {
        this.userService = userService;
    }
   async  getUserProfile (req, reply)
    {
        const result = await this.userService.getUserProfile (req.params, req.user.username);
        return reply.status (200).send(result);
    }

    async updateUsernameBio (req, reply)
    {
        const newusername = req.body?.newusername;
        const bio = req.body?.bio;
        const result = await this.userService.updateUsernameBio (req.params.username, newusername, bio, req.user.username);
        return reply.status (200).send(result);
    }

    async updataPassword (req, reply)
    {
        const result = await this.userService.updataPassword (req.params.username, req.body, req.user.username);
        return reply.status (200).send(result);
    }
    
    async updateAvatar (req, reply)
    {
        const result = await this.userService.updateAvatar (req.params.username, req.body, req.user.username);
        return reply.status (200).send(result);
    }
}

export default UserController;
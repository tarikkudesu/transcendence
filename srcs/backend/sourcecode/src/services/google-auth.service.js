import generateUserName from "../utils/generateUsername.js";
import generateUserToken from '../utils/generateUserToken.js';
import setTokenCookie from '../utils/setTokenCookie.js';

class GoogleAuthService
{
    constructor (fastify, userRepo)
    {
        this.fastify = fastify;
        this.userRepo = userRepo;
    }
    async createUserGoogle (req, reply)
    {
        const {token} = await this.fastify.googleOauth2.getAccessTokenFromAuthorizationCodeFlow (req);
        const userInfo = await this.fastify.googleOauth2.userinfo (token);
        const username = generateUserName (userInfo.given_name, userInfo.family_name, this.fastify);
        this.userRepo.createUser (userInfo.email, username, "");
        this.userRepo.setAvatarurl(username, userInfo.picture);
        this.userRepo.verifyUser(username);
        setTokenCookie (reply, generateUserToken(this.fastify, this.userRepo.findUserByUsername(username)));
        return {success : true};
    }
}

export default GoogleAuthService;
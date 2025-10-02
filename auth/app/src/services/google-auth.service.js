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
        const { token } = await this.fastify.googleOauth2.getAccessTokenFromAuthorizationCodeFlow (req);
        const userInfo = await this.fastify.googleOauth2.userinfo (token);
        let user = await this.userRepo.findUserByEmail(userInfo.email);
        if (!user)
        {
            const username = await generateUserName (userInfo.given_name, userInfo.family_name, this.fastify);
            await this.userRepo.createUser (userInfo.email, username, "");
            await  this.userRepo.updateAvatarurl(username, userInfo.picture);
            user = await this.userRepo.findUserByUsername(username);
            await this.userRepo.verifyUser(username);
            user = await this.userRepo.findUserByUsername(username);
        }
        const tokenAccess = await generateUserToken (this.fastify, user, '15m');
        const tokenRefresh = await generateUserToken (this.fastify, user, '7d');
        setTokenCookie (reply, tokenAccess, 'AccessToken', 15 * 60);
        setTokenCookie (reply, tokenRefresh, 'RefreshToken', 7 * 24 * 60 * 60, '/api/v1/auth/refresh');
        return {success : true};
    }
}

export default GoogleAuthService;

import GoogleAuthService from "../services/google-auth.service.js";
import GoogleAuthController from "../controllers/google-auth.controller.js";
import UserRepository from "../repository/user.repository.js";


export default async (fastify) => 
{
    const userRepo = new UserRepository (fastify.db);
    const service = new GoogleAuthService (fastify, userRepo);
    const controller = new GoogleAuthController (service);

    fastify.get ('/auth/callback', controller.googleCallback.bind (controller));
}
import { config } from "../config/env.config.js";

class GoogleAuthController {
  constructor(googleAuthService) {
    this.googleAuthService = googleAuthService;
  }

  async googleCallback(req, reply) {
    try {
      await this.googleAuthService.createUserGoogle(req, reply);
    } catch (error) {
		console.log(error);
    }
	reply.code(302).header("Location", config.domain).send();
  }
}

export default GoogleAuthController;

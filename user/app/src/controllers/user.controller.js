import { config } from '../config/env.config.js';
import { forward } from '../utils/forward.js';

class UserController {
	constructor(userService) {
		this.userService = userService;
	}

	async getMyProfile(req, reply) {
		const me = req.headers['x-auth-user'];
		const result = await this.userService.getUserProfile({ username: me });
		return reply.status(200).send(result);
	}

	async getUserProfile(req, reply) {
		const result = await this.userService.getUserProfile(req.params);
		return reply.status(200).send(result);
	}

	async updateUsername(request, reply) {
		const newusername = request.body.newusername;
		const username = request.headers['x-auth-user'];
		const user = await this.userService.updateUsername({ username, newusername });
		let body = JSON.stringify({ user });
		request.headers['content-length'] = body.length;
		await forward(`${config.servers.auth}/internal/token/regenerate`, request, reply, {
			method: 'POST',
			headers: {
				...request.headers,
				'x-auth-user': request.user?.username,
			},
			body,
		});
	}

	async updateBio(req, reply) {
		const bio = req.body.bio;
		const username = req.headers['x-auth-user'];
		const result = await this.userService.updateBio({ username, bio });
		return reply.status(203).send(result);
	}

	async updataPassword(req, reply) {
		const username = req.headers['x-auth-user'];
		const result = await this.userService.updatePassword({ username, newpassword: req.body.newpassword });
		return reply.status(200).send(result);
	}

	async uploadUpdatedAvatar(req, reply) {
		const username = req.headers['x-auth-user'];
		const result = await this.userService.uploadUpdatedAvatar({ username, avatar: req.body?.avatar });
		return reply.status(200).send(result);
	}

	async createUser(req, reply) {
		req.body = JSON.parse(req.body);
		const result = await this.userService.createUser(req.body);
		return reply.status(200).send(result);
	}

	async verifyUser(req, reply) {
		req.body = JSON.parse(req.body);
		const result = await this.userService.verifyUser(req.body);
		return reply.status(200).send(result);
	}

	async updateAvatarurl(req, reply) {
		req.body = JSON.parse(req.body);
     	const result = await this.userService.updateAvatarurl(req.body);
		return reply.status(200).send(result);
	}

	async findUserByUsername(req, reply) {
		const result = await this.userService.findUserByUsername(req.params);
		return reply.status(200).send(result);
	}

	async findUserByEmail(req, reply) {
		const result = await this.userService.findUserByEmail(req.params);
		return reply.status(200).send(result);
	}

	findAllUsernames(req, reply) {
		const result = this.userService.findAllUsernames();
		return reply.status(200).send(result);
	}

	async activateTwoFa(req, reply) {
		const username = req.headers['x-auth-user'];
		const result = await this.userService.activateTwoFa(username);
		reply.send(result);
	}

	async deleteAccount(req, reply) {
		const username = req.headers['x-auth-user'];
		const result = await this.userService.deleteAccount({ username });
		reply.send(result);
	}
}

export default UserController;

import getDefaultAvatar from '../utils/getDefaultAvatar.js';
import uploadFile from '../utils/uploadFile.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcrypt';
import sendMessage from '../mq/user.producer.js';

class UserService {
	constructor(userRepo, fastify) {
		this.fastify = fastify;
		this.userRepo = userRepo;
	}

	async getUserProfile({ username }) {
		const user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError('user not found', 404);
		const userProfile = {
			username: user.username,
			email: user.email,
			bio: user.bio,
			created_at: user.created_at,
			avatar: user.avatar_url,
			active: user.twofa,
		};
		return userProfile;
	}

	async updateUsername({ username, newusername }) {
		let user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError("user doesn't not exist", 404);
		const check = this.userRepo.findUserByUsername(newusername);
		if (check) throw new AppError('this username already exists', 409);
		this.userRepo.updateUsername(username, newusername);
		await sendMessage(this.fastify.mq?.channel, {
			type: 'UPDATE_USERNAME',
			username,
			newusername,
		});
		user.username = newusername;
		return user;
	}

	async updateBio({ username, bio }) {
		let user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError("user doesn't not exist", 404);
		const toAdd = bio.trim();
		if (!toAdd) throw new AppError('not a valid bio content', 400);
		this.userRepo.updateBio(username, toAdd);
		return { success: true, message: 'User profile updated successfully.' };
	}

	async updatePassword({ username, newpassword }) {
		let user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError("user doesn't not exist", 404);
		const hashedPassword = await bcrypt.hash(newpassword, 10);
		this.userRepo.updatePasswordByUsername(username, hashedPassword);
		return { success: true, message: 'User profile updated successfully.' };
	}

	async activateTwoFa(username) {
		let user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError('user does not exist', 404);
		this.userRepo.updateTwoFa(username, !user['twofa']);
		return {
			success: true,
			message: user['twofa'] ? '2FA Disabled Successfully' : '2FA Enabled Successfully',
		};
	}

	async uploadUpdatedAvatar({ username, avatar }) {
		let user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError("user doesn't not exist", 404);
		if (!avatar) throw new AppError('Must send image file', 400);
		const avatar_url = await uploadFile(username, avatar);
		this.userRepo.updateAvatarurl(username, avatar_url);
		await sendMessage(this.fastify.mq?.channel, {
			type: 'UPDATE_AVATAR',
			username,
			avatar_url,
		});
		return { success: true, message: 'your avatar updated successfully' };
	}

	// ------------------------------ this internal endpoint ----------------------------
	async createUser({ email, username, hashedPassword }) {
		try {
			this.userRepo.createUser(email, username, hashedPassword);
			return { success: true, message: 'this user has been created' };
		} catch (err) {
			void err;
			console.log(err);
			throw new AppError('this user already Exist', 409);
		}
	}

	async verifyUser({ username }) {
		const user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError('User not Found', 404);
		this.userRepo.verifyUser(username);
		if (!user.avatar_url) {
			user.avatar_url = getDefaultAvatar();
			await this.userRepo.updateAvatarurl(username, user.avatar_url);
		}
		await sendMessage(this.fastify.mq?.channel, {
			type: 'CREATE_USER',
			username: user.username,
			avatar_url: user.avatar_url,
		});
		return { success: true, message: 'this user is verified successfully' };
	}

	async updateAvatarurl({ username, avatar_url }) {
		const user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError('User not Found', 404);
		this.userRepo.updateAvatarurl(username, avatar_url);
		await sendMessage(this.fastify.mq?.channel, {
			type: 'UPDATE_AVATAR',
			username,
			avatar_url,
		});
		return { success: true, message: 'your avatar updated' };
	}

	async findUserByUsername({ username }) {
		const user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError('User not Found', 404);
		return user;
	}
	async findUserByEmail({ email }) {
		const user = this.userRepo.findUserByEmail(email);
		if (!user) throw new AppError('User not Found', 404);
		return user;
	}

	// ----------------------------- added ------------

	findAllUsernames(req, reply) {
		return this.userRepo.findAllUsernames();
	}

	async deleteAccount({ username }) {
		const user = this.userRepo.findUserByUsername(username);
		if (!user) throw new AppError('User not Found', 404);
		this.userRepo.deleteByUsername(username);
		return { success: true, massage: 'the user deleted successfully' };
	}
}

export default UserService;

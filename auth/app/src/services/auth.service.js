import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { config } from '../config/env.config.js';
import AppError from '../utils/AppError.js';
import generateUserToken from '../utils/generateUserToken.js';
import genrateRandomNum from '../utils/genrateRandomNum.js';
import setTokenCookie from '../utils/setTokenCookie.js';

class AuthService {
	constructor(userRopo, fastify) {
		this.fastify = fastify;
		this.userRopo = userRopo;
	}

	async sendMail({ email }, cookies) {
		let user;
		const token = cookies?.OtpToken;
		if (!email && !token) throw new AppError('Please login before passing to 2FA process.', 403);
		if (token)
			try {
				user = this.fastify.jwt.verify(token);
			} catch (error) {
				throw new AppError('invalid credentials', 400);
			}
		if (email) user = await this.userRopo.findUserByEmail(email);
		if (!user) throw new AppError('No account found with this email address.', 404);
		return this.#sendOtp(user.email);
	}

	async #sendOtp(email) {
		const verificationCode = genrateRandomNum(100_000, 1_000_000);
		await this.fastify.cache.set(email, verificationCode.toString(), 60 * 15);
		await this.fastify.channel.sendToQueue({
			service: 'mail',
			to: email,
			subject: 'verification code',
			body: verificationCode,
			type: 'OTP',
		});

		return { success: true, message: 'code sent successfully' };
	}

	async verifyTwoFa({ verificationCode }, cookies, reply) {
		let user;
		const token = cookies.OtpToken;
		if (!token) throw new AppError('Please login before passing to 2FA process.', 403);
		try {
			user = this.fastify.jwt.verify(token);
		} catch (error) {
			console.log(error);
			throw new AppError('invalid credentials', 400);
		}
		user = await this.userRopo.findUserByEmail(user.email);
		if (!user) throw new AppError('invalid credentials, please try again', 400);
		if (!user.is_verified) {
			const OtpToken = await generateUserToken(this.fastify, { email: user.email, username: user.username }, '15m');
			setTokenCookie(reply, OtpToken, 'OtpToken', 15 * 60, '/api/v1/auth');
			throw new AppError('Please verify your email before logging in.', 303, '/verify-account');
		}
		const record = await this.fastify.cache.get(user.email);
		if (record != verificationCode) throw new AppError('Invalid verification code. Please try again.', 400);
		await this.fastify.cache.del(user.email);
		setTokenCookie(reply, '', 'OtpToken', -1, '/api/v1/auth');
		const tokenAccess = await generateUserToken(this.fastify, user, '15m');
		const tokenRefresh = await generateUserToken(this.fastify, user, '7d');
		setTokenCookie(reply, tokenAccess, 'AccessToken', 15 * 60);
		setTokenCookie(reply, tokenRefresh, 'RefreshToken', 7 * 24 * 60 * 60, '/api/v1/auth/refresh');
		return { success: true, message: 'verification done successfully' };
	}

	async verifyUser({ verificationCode }, cookies, reply) {
		const token = cookies.OtpToken;
		let user;
		try {
			user = this.fastify.jwt.verify(token);
		} catch (error) {
			console.log(error);
			throw new AppError('invalid credentials', 400);
		}
		user = await this.userRopo.findUserByEmail(user.email);
		if (!user) throw new AppError('No account found with this email address.', 404);
		if (user.is_verified) throw new AppError('This user is already verified', 409);
		const record = await this.fastify.cache.get(user.email);
		if (record != verificationCode) throw new AppError('Invalid verification code. Please try again.', 400);
		await this.userRopo.verifyUser(user.username);
		await this.fastify.cache.del(user.email);
		setTokenCookie(reply, '', 'OtpToken', -1, '/api/v1/auth');
		const tokenAccess = await generateUserToken(this.fastify, user, '15m');
		const tokenRefresh = await generateUserToken(this.fastify, user, '7d');
		setTokenCookie(reply, tokenAccess, 'AccessToken', 15 * 60);
		setTokenCookie(reply, tokenRefresh, 'RefreshToken', 7 * 24 * 60 * 60, '/api/v1/auth/refresh');
		return { success: true, message: 'verification done successfully' };
	}

	async signup({ email, username, password }, reply) {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await this.userRopo.createUser(email, username, hashedPassword);
		if (!user) throw new AppError('This account already exists. Please sign in.', 409);
		const OtpToken = await generateUserToken(this.fastify, { email, username }, '15m');
		setTokenCookie(reply, OtpToken, 'OtpToken', 15 * 60, '/api/v1/auth');
		const result = await this.#sendOtp(email);
		return { success: true, message: 'A verification code has been sent to your email, please check your email inbox' };
	}

	async login({ username, password }, reply) {
		const user = await this.userRopo.findUserByUsername(username);
		if (!user) throw new AppError('invalid credentials, please try again', 400);
		if (!(await bcrypt.compare(password, user.password))) throw new AppError('Invalid credentials, please try again', 400);
		if (!user.is_verified) {
			const OtpToken = await generateUserToken(this.fastify, user, '15m');
			setTokenCookie(reply, OtpToken, 'OtpToken', 15 * 60, '/api/v1/auth');
			await this.#sendOtp(user.email);
			throw new AppError('Please verify your email before logging in.', 303, '/verify-account');
		}
		if (user.twofa) {
			const OtpToken = await generateUserToken(this.fastify, user, '15m');
			setTokenCookie(reply, OtpToken, 'OtpToken', 15 * 60, '/api/v1/auth');
			await this.#sendOtp(user.email);
			throw new AppError(
				'A verification code has been sent to your email, please check your email inbox',
				303,
				'/2fa-authentication'
			);
		}
		const tokenAccess = await generateUserToken(this.fastify, user, '15m');
		const tokenRefresh = await generateUserToken(this.fastify, user, '7d');
		setTokenCookie(reply, tokenAccess, 'AccessToken', 15 * 60);
		setTokenCookie(reply, tokenRefresh, 'RefreshToken', 7 * 24 * 60 * 60, '/api/v1/auth/refresh');
		return { success: true, message: 'Logged In successfully' };
	}

	async refreshToken({ RefreshToken }, reply) {
		if (!RefreshToken) throw AppError('Invalid refresh token', 400);
		try {
			const user = await this.fastify.jwt.verify(RefreshToken);
			const tokenAccess = await generateUserToken(this.fastify, user, '15m');
			setTokenCookie(reply, tokenAccess, 'AccessToken', 15 * 60);
		} catch (error) {
			throw AppError('Invalid refresh token', 400);
		}
		return { success: true, message: 'token refreshed' };
	}
	async logout(reply) {
		setTokenCookie(reply, '', 'AccessToken', -1);
		setTokenCookie(reply, '', 'RefreshToken', -1, '/api/v1/auth/refresh');
		setTokenCookie(reply, '', 'LoginTokenSend', -1);
		return { success: true, message: 'logged out successfully.' };
	}

	#generateToken(length = 30) {
		return randomBytes(length).toString('hex').slice(0, length);
	}

	async forgotPassword({ email }, reply) {
		const user = await this.userRopo.findUserByEmail(email);
		if (!user) throw new AppError('No account found with this email address.', 404);
		let token = this.#generateToken();
		const ResetToken = await generateUserToken(this.fastify, { email: user.email, username: user.username }, '15m');
		setTokenCookie(reply, ResetToken, 'ResetToken', 15 * 60, '/api/v1/auth/reset-password');
		this.fastify.cache.set(email, token, 15 * 60);
		let cachedToken = await this.fastify.cache.get(user.email);
		await this.fastify.channel.sendToQueue({
			service: 'mail',
			to: email,
			subject: 'reset your password',
			body: `${config.domain}/reset-password?token=${token}`,
			type: 'OTT',
		});
		return {
			success: true,
			email: user.email,
			message: 'An email has been sent to you, please check your email inbox',
		};
	}

	async resetPassword(reply, cookies, token, password, confirmPass) {
		const ResetToken = cookies.ResetToken;
		let user;
		try {
			user = this.fastify.jwt.verify(ResetToken);
		} catch (error) {
			console.log(error);
			throw new AppError('invalid credentials', 400);
		}
		if (password != confirmPass) throw new AppError('the password should be the same', 400);
		setTokenCookie(reply, '', 'ResetToken', -1, '/api/v1/auth/reset-password');
		const cachedToken = await this.fastify.cache.get(user.email);
		if (!cachedToken) throw new AppError('token expired', 400);
		await this.fastify.cache.del(user.email);
		if (cachedToken !== token) throw new AppError('invalid credentials', 400);
		await this.userRopo.resetPassword(user.email, password);
	}

	async regenerate(user, reply) {
		const tokenAccess = await generateUserToken(this.fastify, user, '15m');
		const tokenRefresh = await generateUserToken(this.fastify, user, '7d');
		setTokenCookie(reply, tokenAccess, 'AccessToken', 15 * 60);
		setTokenCookie(reply, tokenRefresh, 'RefreshToken', 7 * 24 * 60 * 60, '/api/v1/auth/refresh');
	}
}

export default AuthService;

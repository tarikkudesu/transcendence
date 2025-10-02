function generateUserToken(fastify, user, timeEx) {
	const token = fastify.jwt.sign(
		{
			email: user.email,
			username: user.username,
			avatar: user.avatar_url,
			created_at: user.created_at,
		},
		{ expiresIn: timeEx }
	);
	return token;
}

export default generateUserToken;

function generateUserToken (fastify, user, timeEx)
{
    const token = fastify.jwt.sign 
    ({id : user.id, username: user.username ,email: user.email}, {expiresIn: timeEx});
    return token;
}

export default generateUserToken;
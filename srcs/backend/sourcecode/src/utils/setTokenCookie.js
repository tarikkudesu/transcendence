function setTokenCookie (reply, token, name, maxAge ,path = '/')
{
    reply.setCookie (name, token,
    {
        path: path,
        secure: false,
        httpOnly: true,
        sameSite: true,
        maxAge: maxAge
    });
}

export default setTokenCookie;
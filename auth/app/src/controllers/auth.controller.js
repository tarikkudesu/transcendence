class AuthController
{
    constructor (authService)
    {
        this.authService = authService;
    }
    async signup (req, reply)
    {
        const result = await this.authService.signup (req.body, reply);
        reply.send (result);
    }
    async login (req, reply)
    {
        const result = await this.authService.login (req.body, reply);
        reply.send (result);
    }

    async refreshToken (req, reply)
    {
        const result = await this.authService.refreshToken (req.cookies, reply);
        reply.send (result);

    }
    async logout (req, reply)
    {
        const result = await this.authService.logout (reply);
        reply.send (result);
    }

    async verifyUser (req, reply)
    {
        const result = await this.authService.verifyUser (req.body, req.cookies, reply);
        reply.send (result);
    }

    async sendMail (req, reply)
    {
        const result = await this.authService.sendMail (req.body, req.cookies);
        reply.send (result);
    }

    async verifyTwoFa (req, reply)
    {
        const result = await this.authService.verifyTwoFa (req.body, req.cookies, reply);
        reply.send (result);
    }

    async forgotPassword (req, reply)
    {
        const result = await this.authService.forgotPassword (req.body, reply);
        reply.send (result);
    }

    async resetPassword (request, reply)
    {
        const { newPassword, repeatNewPassword, token } = request.body;
        await this.authService.resetPassword(reply, request.cookies, token, newPassword, repeatNewPassword);
        reply.send({
            success: true,
            message: 'password updated successfully'
        })
    }

    async regenerate (request, reply) {
        let { user } = request.body

        await this.authService.regenerate(user, reply);
        reply.send({ success: true, message: 'Updated Successfully' })
    }
}

export default AuthController;
 
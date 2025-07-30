class GoogleAuthController
{
    constructor (googleAuthService)
    {
        this.googleAuthService = googleAuthService;
    }
    async googleCallback (req, reply)
    {
        try 
        {
            const result = await this.googleAuthService.createUserGoogle (req, reply);
            return result;
        }
        catch (error)
        {
            reply.status (401).send ({err : error.message});
        }
    }
}

export default GoogleAuthController;
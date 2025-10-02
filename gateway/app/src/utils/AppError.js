export default class AppError extends Error
{
    constructor (message , statusCode = 200)
    {
        super (message);
        this.statusCode = statusCode;
    }

};
export default class AppError extends Error
{
    constructor (message , statusCode = 200, path)
    {
        super (message);
        this.path = path;
        this.statusCode = statusCode;
    }

};
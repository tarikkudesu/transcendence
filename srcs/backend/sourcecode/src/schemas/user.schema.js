const passwordHandler = {type: 'string', minLength : 8, maxLength: 20};
const usernameHandler = {type: 'string', pattern : '^[a-zA-Z0-9_]+$', minLength : 4, maxLength: 20};

const avatarSchema =  
{
    type : 'object',
    required : ['filename', 'mimetype'],
    properties : 
    {
        filename : {type : 'string'},
        mimetype : {type : 'string', pattern : '^image/'},
    }
};





const updateUsernameBioSchema = 
{
        body : 
        {
            type : 'object',
            properties : 
            {
                newusername : usernameHandler,
                bio : {type : 'string' , maxLength : 200}
            }
        }
};

const updatePasswordSchema = 
{
        body : 
        {
            type : 'object',
            required : ['newpassword'],
            properties : 
            {
                newpassword: passwordHandler,
            },
        }
};


const updataAvatarSchema = 
{
    body :
    {
        required : ['avatar'],
        type : 'object',
        properties :
        {
                avatar : avatarSchema,
        }
    }
}

export {
    updateUsernameBioSchema,
    updatePasswordSchema,
    updataAvatarSchema
};
const avatarSchema =  
{
    type : 'object',
    required : ['filename', 'mimetype'],
    properties : { 
		filename : { type: 'string', pattern : '\.(jpg|jpeg|png|gif|webp)$' },
        mimetype : { type: 'string', pattern : '^image/' },
    }
};

export const updateBioSchema = 
{
    body : {
        type : 'object',
        required : ['bio'],
        properties : {
            bio : {type : 'string', maxLength : 200}
        },
        errorMessage : {
            required : {
                bio : 'bio is required',
            },
            properties : {
                bio : 'bio must be low than 200 character',
            },
        }
    },
};

export const updateUsernameSchema = 
{
    body : {
        type : 'object',
        required : ['newusername'],
        properties : {
            newusername : {type: 'string', pattern : '^[a-zA-Z0-9_]+$', minLength : 4, maxLength: 20},
        },
        errorMessage : {
            required : {
                newusername : 'username is required',
            },
            properties : {
                newusername : 'username must be 4-20 characters and contain only letters, numbers, or underscores',
            },
        }
    },
};

export const updatePasswordSchema = 
{
        body : 
        {
            type : 'object',
            required : ['newpassword'],
            properties : 
            {
                newpassword: {type: 'string', minLength : 8, maxLength: 20}
            },
            errorMessage : 
            {
                required : 
                {
                    newpassword : 'newpassword is required',   
                },
                properties : 
                {
                    newpassword :  'Password must be 8-20 characters long',
                }
            }
        }
};


export const updataAvatarSchema = 
{
    body :
    {
        required : ['avatar'],
        type : 'object',
        properties :
        {
           avatar : avatarSchema,
        },
        errorMessage: 'Avatar must be a valid image file',
    }
}

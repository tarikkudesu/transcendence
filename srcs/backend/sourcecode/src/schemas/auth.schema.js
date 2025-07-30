const emailHandler = {type: 'string', format:'email', maxLength : 320};
const passwordHandler = {type: 'string', minLength : 8, maxLength: 20};
const verificationCodeHandler = {type: 'string', pattern : '^\\d{6}$' , minLength : 6, maxLength: 6};

const signupSchema = {
    body : 
    {
        type: 'object',
        required : ['email', 'username' ,'password'],
        properties :
        {
            email : emailHandler,
            username: {type: 'string', pattern : '^[a-zA-Z0-9_]+$', minLength : 4, maxLength: 20},
            password: passwordHandler
        },
        additionalProperties: false
    }
};

const loginSchema = {
    body :
    {
        type: 'object',
        required : ['username', 'password'],
        properties :
        {
            username: {type: 'string', pattern : '^[a-zA-Z0-9_]+$', minLength : 4, maxLength: 20},
            password: passwordHandler
        },
        additionalProperties: false
    }
};

const resetPasswordSchema = 
{
    body :
    {
        type: 'object',
        required : ['email', 'newpassword', 'verificationCode'],
        properties : 
        {
            email : emailHandler,
            password: passwordHandler,
            verificationCode: verificationCodeHandler
        },
        additionalProperties: false
    }
}

const emailSchema = {
    body : 
    {
        type : 'object',
        required : ['email'],
        properties : 
        {
            email : emailHandler,
        }
    }
}

const codeSchema = {
    body : 
    {
        type : 'object',
        required : ['email', 'verificationCode'],
        properties : 
        {
            email : emailHandler,
            verificationCode : verificationCodeHandler
        }
    }
}

const complitProfileSchema = 
{
    body :
    {
        type : 'object',
        properties :
        {
                bio : 
                {
                    type : 'object',
                    properties :
                    {
                        value : 
                        {
                            type : 'string',
                            minLength : 1,
                            pattern : '.*\\S.*$'
                        },
                    },
                    required : ['value'],
                },

                avatar :
                {
                    type : 'object',
                    required : ['filename', 'mimetype'],
                    properties : 
                    {
                        filename : {type : 'string'},
                        mimetype : {type : 'string', pattern : '^image/'},
                    }
                }
        }
    }
}

export  {
            signupSchema,
            loginSchema,
            resetPasswordSchema,
            emailSchema,
            codeSchema,
            complitProfileSchema
        };
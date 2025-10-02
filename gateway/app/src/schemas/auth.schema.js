const emailHandler = {type: 'string', format:'email', maxLength : 320};
const passwordHandler = {type: 'string', minLength : 8, maxLength: 20};
const verificationCodeHandler = {type: 'string', pattern : '^\\d{6}$' , minLength : 6, maxLength: 6};
const tokenSchema = {type: 'string' , minLength : 30, maxLength: 30};

export const signupSchema = {
    body : 
    {
        type: 'object',
        required : ['email', 'username' ,'password'],
        properties :
        {
            email : emailHandler,
            username: {type: 'string', pattern : '^[a-zA-Z0-9_]+$', minLength : 3, maxLength: 20},
            password: passwordHandler
        },
        errorMessage : 
        {
            required : 
            {
                email: 'Email is required',
                username: 'username is required',
                password : 'password is required',
            },
            properties :
            {
                email : 'Email is invalid',
                username : 'Username must be 4-20 characters and contain only letters, numbers, or underscores',
                password :  'Password must be 8-20 characters long',
            },
        }
    },
};

export const loginSchema = {
    body :
    {
        type: 'object',
        required : ['username', 'password'],
        properties :
        {
            username: {type: 'string', pattern : '^[a-zA-Z0-9_]+$', minLength : 3, maxLength: 20},
            password: passwordHandler
        },
        errorMessage : 
        {
            required : 
            {
                username : 'username is required',
                password : 'password is required',
            },
            properties : 
            {
                username : 'Username must be 4-20 characters and contain only letters, numbers, or underscores',
                password :  'Password must be 8-20 characters long',  
            },
        }
    },
};

export const resetPasswordSchema = 
{
    body :
    {
        type: 'object',
        required : ['newPassword', 'repeatNewPassword', 'token'],
        properties : 
        {
            repeatNewPassword : passwordHandler,
            newPassword: passwordHandler,
            token: tokenSchema
        },
        errorMessage : 
        {
            required : 
            {
                repeatNewPassword : 'repeatNewPassword is required',
                newPassword : 'newpassword is required',
                token : 'token is required',
            },
            properties : 
            {
                repeatNewPassword : 'Password must be 8-20 characters long',
                newPassword :  'Password must be 8-20 characters long',
                token : 'token is invalid'
            },
        }
    },
}

export const emailSchema = {
    body : 
    {
        type : 'object',
        required : ['email'],
        properties : 
        {
            email : emailHandler,
        },
        errorMessage : 
        {
            required : 
            {
                email : 'email is required',   
            },
            properties : 
            {
                email : 'Email is invalid',
            }
        }
    },
}

export const codeSchema = {
    body : 
    {
        type : 'object',
        required : ['verificationCode'],
        properties : 
        {
            verificationCode : verificationCodeHandler
        },
        errorMessage : 
        {
            required : 
            {
                verificationCode : 'verificationCode is required',
            },
            properties : 
            {
                verificationCode : 'Verification code must be exactly 6 digits'
            }
        }
    },
}


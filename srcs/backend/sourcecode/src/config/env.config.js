
import doenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath (import.meta.url);
const __dirname = dirname(__filename);
doenv.config ({path : join( __dirname, '..', '..', '.env')});

const config = {
	host: process.env.HOST,
    port : process.env.PORT,
    db_path : process.env.DB_PATH,
    jwt_secret : process.env.JWT_SECRET,

    cloudinary_name : process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_key : process.env.CLOUDINARY_API_KEY,
    cloudinary_secret : process.env.CLOUDINARY_API_SECRET,

    redirect_uri : process.env.REDIRECT_URI,
    client_id : process.env.CLIENT_ID,
    client_secret : process.env.CLIENT_SECRET,
    
    email_user : process.env.EMAIL_USER,
    email_password : process.env.EMAIL_PASS ,
    email_host : process.env.EMAIL_HOST,

    redis_url : process.env.REDIS_URL,
}

export {config};
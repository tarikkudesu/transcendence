import {v2 as cloudinary} from 'cloudinary';
import { config } from '../config/env.config.js';


cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_key,
    api_secret: config.cloudinary_secret,
    secure: true
});

export default cloudinary;
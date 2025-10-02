import cloudinary from "../plugins/cloudinary-plugin.js";
import AppError from "./AppError.js"


async function uploadFile (username, avatar)
{
     if (!avatar)
          throw new AppError('Invalid or empty file', 400);
     if (avatar.file.truncated) 
          throw new AppError('File too Large', 413);
     const base64Str = `data:${avatar.mimetype};base64,${avatar._buf.toString('base64')}`;
     const uploadResult = await cloudinary.uploader.upload(base64Str, 
     {
          public_id: `avatar_${username}`,
          folder: 'fastify_avatar',
          overwrite: true,
          resource_type: 'image',
     });
     return uploadResult.secure_url;
}

export default uploadFile;
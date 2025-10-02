import genrateRandomNum from "./genrateRandomNum.js";

function getDefaultAvatar ()
{
    const id = genrateRandomNum (1, 261);
    const defaultAvatar = `https://res.cloudinary.com/drpmyxx4c/image/upload/v1751976105/avatars/avatar${id}.png`;
    return defaultAvatar;
}

export default getDefaultAvatar;
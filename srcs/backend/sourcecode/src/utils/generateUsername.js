
import UserRepository from '../repository/user.repository.js'

function generateUniqueUserName(given, family, fastify)
{
    const userRepo = new UserRepository (fastify.db);
    let index = 0;

    while (userRepo.findUserByUsername (given))
    {
        if (index < family.length)
            given += family[index];
        else
            given += '_';
    }
    return given;
}

export default generateUniqueUserName;
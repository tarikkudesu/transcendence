import { UserRepository } from '../repositories/user.repository.js'

async function generateUniqueUserName(given, family, fastify) {
    const userRepo = new UserRepository(fastify.db);
    const usernames = await userRepo.findAllUsernames ();
    let index = 0;

    while (usernames?.some(name => name.username === given)) {
        given += (index < family.length) ?  family[index] :  '_';
        index++;
    }

    return given;
}

export default generateUniqueUserName;
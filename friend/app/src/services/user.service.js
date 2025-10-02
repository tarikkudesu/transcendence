export class UserService
{
    constructor(userRepository)
    {
        this.userRepository = userRepository;
    }

    getAll()
    {
        return this.userRepository.findAll();
    }

    getUserById(id)
    {
        return this.userRepository.findOne({ id });
    }

    getUserByUsername( username )
    {
        return this.userRepository.findOne({ username });
    }

    addUser(data)
    {
        const user = {
            username: data.username,
            avatar_url: data.avatar_url
        };
        this.userRepository.insert(user);
    }

    updateUser(username, data)
    {
        this.userRepository.update({ username }, data);
    }

    getUsersByKeyword(authUser, { keyword }, { begin, end })
    {
        return this.userRepository.findByKeyword(authUser, keyword, begin, end)
    }
}

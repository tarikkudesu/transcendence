import {config} from '../config/env.config.js'
import AppError from '../utils/AppError.js';

export class UserRepository 
{
    async findUserByEmail(email)
    {
        let user = await this.#getFetch(`/internal/users/email/${email}`);
        return user;
    }

    async findUserByUsername(username)
    {
        let user = await this.#getFetch(`/internal/users/username/${username}`);
        return user;
    }

    async createUser(email, username, hashedPassword)
    {
        const response = await this.#fetch('POST', `/internal/users`, {
            email,
            username,
            hashedPassword
        });
        return response;
    }

    async verifyUser (username)
    {
        const response = await this.#fetch('PUT', '/internal/users/state', {
            username
        });
        return response;
    }

    async findAllUsernames ()
    {
        const response = await this.#getFetch('/internal/users/usernames');
        return response;
    }

    async updateAvatarurl(username, picture)
    {
        const response = await this.#fetch('POST' ,'/internal/users/avatar', {
            username,
            avatar_url: picture
        });
        return response;
    }

    async resetPassword(email, newpassword)
    {
        const response = await this.#fetch('POST', '/api/v1/users/reset-password', {
            email,
            newpassword
        });
        return response
    }

    async #getFetch(uri)
    {
        try {
            let response = await fetch(config.servers.user + uri)		
            if (!response.ok)
				return null;
            response = await response.json()
            return response
        } catch (error) {
            console.log(error);
			throw  new AppError ('Service unavailable', 503);
        }
    }
    
    async #fetch(method, uri, body)
    {
        try {
            let response = await fetch(config.servers.user + uri, {
                method,
                body: JSON.stringify(body)
            });
            if (!response.ok)
                return null;
            response = await response.json()
            return response
        } catch (error) {
            console.log(error);
            throw  new AppError ('Service unavailable', 503);
        }
    }
}

import apiUserRoute from './user.route.js';
import internalUserRoute from './internal.route.js';

export default (fastify) =>
{
    fastify.register (apiUserRoute, { prefix: '/api/v1/users' });
    fastify.register (internalUserRoute, { prefix: '/internal/users' });
}

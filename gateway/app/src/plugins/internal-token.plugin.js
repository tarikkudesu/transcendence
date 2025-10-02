import fp from 'fastify-plugin';
import crypto from 'crypto';

export default fp((fastify) => {
    fastify.decorate('internalToken', (origin) => {
        const randomBytes = crypto.randomBytes(16).toString('hex');
        const timestamp = Date.now();
        return `${origin}-${randomBytes}-${timestamp}`;
    })
});

import { config } from "../config/env.config.js";
import { friendSchema } from "../schemas/friend.chema.js";

export const friend = async (fastify) => {
  const forward = (request, reply) => {
    try {
      reply.from(`${config.servers.FRIEND}${request.url}`, {
        rewriteRequestHeaders: (request, headers) => {
          return {
            ...headers,
            "X-Request-Origin": fastify.internalToken("user"),
          };
        },
        body: request.body,
      });
    } catch (error) {
      console.log(error);
      reply.status(503).send({ error: `Service unavailable` });
    }
  };

  fastify.addHook("onRequest", async (request, reply) => {
    await fastify.authenticate(request, reply);
  });

  fastify.get('/', forward);

  fastify.get('/request', forward);

  fastify.get('/blocked', forward);

fastify.get('/u/:keyword', forward);

  fastify.put('/accept', { schema: friendSchema }, forward);

  fastify.post('/add', { schema: friendSchema }, forward);

  fastify.post('/check', { schema: friendSchema }, forward);

  fastify.put('/block', { schema: friendSchema }, forward);

  fastify.delete('/remove', { schema: friendSchema }, forward);
};

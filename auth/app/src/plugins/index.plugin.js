import fp from "fastify-plugin";
import pluginJwt from "./jwt.plugin.js";
import mqPlugin from "./amqp.plugin.js";
import redisPlugin from "./redis.plugin.js";
import fastifyCookie from "@fastify/cookie";
import fastifyMetrix from "fastify-metrics";
import { config } from "../config/env.config.js";
import googleAuthPlugin from "./google-auth.plugin.js";

export default fp(async (fastify) => {
  if (config.env !== "production")
    await fastify.register(await import("fastify-print-routes"));
  await fastify.register(fastifyMetrix, {
    endpoint: "/metrics",
  });
  await fastify.register(fastifyCookie);
  await fastify.register(redisPlugin);
  await fastify.register(pluginJwt);
  await fastify.register(googleAuthPlugin);
  await fastify.register(mqPlugin);
});

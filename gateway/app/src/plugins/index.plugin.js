import fp from "fastify-plugin";
import fastifyMetrix from "fastify-metrics";
import multipartPlugin from "@fastify/multipart";
import { config } from "../config/env.config.js";

export default fp(async (fastify) => {
  await fastify.register(multipartPlugin, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 4 * 1024 * 1024,
    },
  });

  await fastify.register(fastifyMetrix, {
    endpoint: "/metrics",
  });
  if (config.env !== "production")
    await fastify.register(await import("fastify-print-routes"));
  await fastify.register(await import("./rabbitmq.plugin.js"));
  await fastify.register(await import("./ping.plugin.js"));
  await fastify.register(await import("./auth.plugin.js"));
  await fastify.register(await import("./internal-token.plugin.js"));
  await fastify.register(await import("@fastify/reply-from"));
});

import fp from "fastify-plugin";
import amqpPlugin from "./amqp.plugin.js";
import fastifyMetrix from "fastify-metrics";
import dbplugin from "./sqlite-db.plugins.js";
import { config } from "../config/env.config.js";
import fastifyMultipart from "@fastify/multipart";

export default fp(async function registerPlugins(fastify) {
  await fastify.register(dbplugin);
  await fastify.register(amqpPlugin);
  if (config.env !== "production")
    await fastify.register(await import("fastify-print-routes"));
  await fastify.register(fastifyMetrix, {
    endpoint: "/metrics",
  });
  await fastify.register(fastifyMultipart, {
    limits: { fileSize: 4_000_000 },
    attachFieldsToBody: true,
    throwFileSizeLimit: false,
  });
});

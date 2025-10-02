import fp from "fastify-plugin";
import mq from "./amqp.plugin.js";
import fastifyMetrix from "fastify-metrics";
import mailerPlugin from "./mailer.plugin.js";
import { config } from "../config/env.config.js";
import fastifyWebsocket from "@fastify/websocket";
import databasePlugin from "./database.plugin.js";
import waitForQueueNotifications from "./consumer.plugin.js";

export default fp(async (fastify) => {
  await fastify.register(fastifyMetrix, {
    endpoint: "/metrics",
  });
  if (config.env !== "production")
    await fastify.register(await import("fastify-print-routes"));
  await fastify.register(fastifyWebsocket);
  await fastify.register(databasePlugin);
  await fastify.register(mailerPlugin);
  await fastify.register(mq);
  await fastify.register(waitForQueueNotifications);
});

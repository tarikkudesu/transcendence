import fp from "fastify-plugin";
import mq from "./amqp.plugin.js";
import db from "./database.plugin.js";
import fastifyMetrix from "fastify-metrics";
import { config } from "../config/env.config.js";
import fastifyWebsocket from "@fastify/websocket";
import publisherPlugin from "./publisher.plugin.js";

export default fp(async (fastify) => {
  await fastify.register(fastifyMetrix, {
    endpoint: "/metrics",
  });
  if (config.env !== "production")
    await fastify.register(await import("fastify-print-routes"));
  await fastify.register(fastifyWebsocket);
  await fastify.register(db);
  await fastify.register(mq);
  await fastify.register(publisherPlugin);
});

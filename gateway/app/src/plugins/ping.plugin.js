import amqplib from "amqplib";
import fp from "fastify-plugin";
import { config } from "../config/env.config.js";

export default fp(async (fastify) => {
  fastify.addHook("onRequest", async (req, res) => {
    try {
      let con = await amqplib.connect(config.servers.RABBITMQ);
      con.close();
      if (req.url.includes("/auth/"))
        await fetch(config.servers.AUTH + "/api/v1/auth/ping");
    } catch (error) {
      if (req.url?.endsWith("google")) res.redirect(config.domain);
      res
        .status(503)
        .send({
          message: "YingYangPong Not Available, please try again later",
        });
    }
  });
});

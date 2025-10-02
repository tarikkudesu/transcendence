import { config } from "../config/env.config.js";
import AppError from "../utils/AppError.js";
export class UserController {
  constructor(fastify) {
    this.fastify = fastify;
  }

  async forwardMultiPart(request, reply, method) {
    let response;
    const form = new FormData();
    const [value, buf] = [request.body?.bio?.value, request.body.avatar?._buf];

    if (!value && !buf) throw new AppError("Empty Request", 400);
    if (request.body?.bio?.value) {
      form.append("bio", request.body.bio.value);
    }
    if (request.body.avatar?._buf) {
      const fileBuffer = request.body.avatar._buf;
      const fileName = request.body.avatar.filename;
      const mimeType = request.body.avatar.mimetype;

      const file = new File([fileBuffer], fileName, { type: mimeType });
      form.append("avatar", file);
    }
    try {
      response = await fetch(`${config.servers.USER}${request.url}`, {
        method,
        headers: {
          "X-Request-Origin": this.fastify.internalToken("user"),
          "x-auth-user": request.user?.username,
        },
        body: form,
      });
      const result = await response.json();
      reply.send(result);
    } catch (error) {
      throw new AppError(
        error.message || "Service temporarily unavailable",
        error.statusCode || 503
      );
    }
    if (!response.ok) {
      let res = await response.json();
      throw new AppError(res.message, res.statusCode);
    }
  }

  forward(request, reply) {
    try {
      return reply.from(`${config.servers.USER}${request.url}`, {
        rewriteRequestHeaders: (request, headers) => {
          return {
            ...headers,
            "X-Request-Origin": this.fastify.internalToken("user"),
          };
        },
        body: request.body ,
      });
    } catch (error) {
      console.log(error);
      reply.status(503).send({ error: `Service unavailable` });
    }
  }

  getUserProfile(request, reply) {
    this.forward(request, reply);
  }

  async updateAvatar(request, reply) {
    return await this.forwardMultiPart(request, reply, "PUT");
  }

  async updateUsername(request, reply) {
    await this.forward(request, reply);
  }

  async updateBio(request, reply) {
    await this.forward(request, reply);
  }

  async updataPassword(request, reply) {
    await this.forward(request, reply);
  }

  async deleteAccount(request, reply) {
    await this.forward(request, reply);
  }
}

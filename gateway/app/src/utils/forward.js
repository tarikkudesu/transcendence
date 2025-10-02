import AppError from "./AppError.js";

export const forwardMultiPart = async (host, request, reply) => {
  const form = new FormData();
  let response;
  const [value, buf] = [request.body?.bio?.value, request.body.avatar?._buf];

  if (!value && !buf) throw new AppError("Empty Request", 400);
  if (request.body?.bio?.value) form.append("bio", request.body.bio.value);
  if (request.body.avatar?._buf) {
    const fileBuffer = request.body.avatar._buf;
    const fileName = request.body.avatar.filename;
    const mimeType = request.body.avatar.mimetype;

    const file = new File([fileBuffer], fileName, { type: mimeType });
    form.append("avatar", file);
  }
  try {
    response = await fetch(`${host}${request.url}`, {
      method: request.method,
      headers: {
        "x-auth-user": request.user?.username,
        ...request.headers,
      },
      body: form,
    });
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
  const result = await response.json();
  return reply.send(result);
};

async function userConsumers(fastify) {
  const channel = fastify?.mq?.channel;
  const uGameQueue = fastify?.mq?.uGameQueue;
  const { users_repo, friendRepo } = fastify;

  channel?.consume(uGameQueue.queue, async (msg) => {
    try {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      if (data.type === "CREATE_USER")
        await users_repo.createUser(data.username, data.avatar_url);
      else if (data.type === "UPDATE_USERNAME") {
        await users_repo.updateUsername(data.username, data.newusername);
        await friendRepo.updateUsername(data.username, data.newusername);
      } else if (data.type === "UPDATE_AVATAR")
        await users_repo.updateAvatarurl(data.username, data.avatar_url);
      channel.ack(msg);
    } catch (err) {
      console.error(err);
      channel.nack(msg, false, true);
    }
  });
}

export default userConsumers;

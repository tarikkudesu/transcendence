async function setupUserConsumers(fastify) {
  const channel = fastify?.mq?.channel;
  const uFreindQueue = fastify?.mq?.uFreindQueue;
  const { users_repo, friendRepo } = fastify;

  channel?.consume(uFreindQueue.queue, async (msg) => {
    try {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      if (data.type === "CREATE_USER")
        users_repo.createUser(data.username, data.avatar_url);
      else if (data.type === "UPDATE_USERNAME") {
        await users_repo.updateUsername(data.username, data.newusername);
        await friendRepo.updateUsername(data.username, data.newusername);
      } else if (data.type === "UPDATE_AVATAR")
        await users_repo.updateAvatarurl(data.username, data.avatar_url);
      channel.ack(msg);
    } catch (err) {
      console.log(err);
      channel.nack(msg, false, true);
    }
  });
}

export default setupUserConsumers;

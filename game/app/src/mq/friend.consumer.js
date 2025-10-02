import { config } from "../config/env.config.js";

async function friendConsumer(fastify) 
{
    const channel = fastify?.mq?.channel;
    const { friendRepo } = fastify;

    await channel?.assertQueue(config.friend_queue);
    channel?.consume(config.friend_queue, async (msg) => {
        try {
            const data = JSON.parse(msg.content.toString());
            if (data.type === 'CREATE_FRIEND')
                friendRepo.insertFriendship(data.u_from, data.u_to);
            else if (data.type === 'DELETE_FRIEND')
                friendRepo.delete(data.u_from, data.u_to);
            channel?.ack(msg);
        }
        catch (err) {
			console.log(err);
			channel.nack(msg, false, true);
		}
    });
}

export default friendConsumer;

async function sendMessage(channel, user) {
    try {
        await channel.publish(
            "user.events", "", Buffer.from(JSON.stringify(user)), { persistent: true }
        );
    } catch (error) {
        console.log(error);
    }
}
  
export default sendMessage;
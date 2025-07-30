import amqplib from 'amqplib';

async function sendMessage(queue, message) {
    try {
        const connection = await amqplib.connect('amqp://localhost'); // or your RabbitMQ URL
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true,
        });

        console.log(`✅ Sent message to ${queue}:`, message);

        await channel.close();
        await connection.close();
    } catch (err) {
        console.error('❌ Failed to send message:', err);
    }
}

// Example test cases:

await sendMessage('addUserQueue', {
    username: 'testUser1',
    avatar_url: 'https://example.com/avatar1.png',
});

await sendMessage('updateUserAvatarQueue', {
    username: 'testUser1',
    avatar_url: 'https://example.com/avatar2.png',
});

await sendMessage('updateUserUsernameQueue', {
    username: 'testUser1',
    newusername: 'newTestUser1',
});

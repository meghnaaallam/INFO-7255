const amqp = require("amqplib")


var connection, channel;

async function connectQueue()  {
    try {
        connection = await amqp.connect({
            protocol: 'amqp',
            hostname: 'localhost',
            port: 5672,
            username: 'guest',
            password: 'guest',
            locale: 'en_US',
          })
        channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME)
    } catch (error) {
        throw error;
    }
}

const getChannel = () => {
    return channel; 
}

const getConnection = () => {
    return connection;
}

const postToQueue = async (plan) => {

    await getChannel().sendToQueue(process.env.QUEUE_NAME, Buffer.from(JSON.stringify(plan)));

}


module.exports = { connectQueue: connectQueue, getChannel: getChannel, getConnection: getConnection,postToQueue:postToQueue }
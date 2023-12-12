import client, {Connection, Channel, Message} from 'amqplib'
import {processTask} from "./processor";

const m1ToM2Queue = 'm1-to-m2-queue';
const m2ToM1Queue = 'm2-to-m1-queue';

export async function consumeTask() {
    const connection: Connection = await client.connect(
        process.env.MSG_QUEUE_URL || "amqp://rabbitmq:5672/"
    );
    console.log(`m2 service consumer listening from queue ${m1ToM2Queue.toString()}`)

    // Create a channel
    const channel: Channel = await connection.createChannel();

    // Makes the m2ToM1Queue available to the client
    await channel.assertQueue(m2ToM1Queue);
    await channel.assertQueue(m1ToM2Queue);

    await channel.consume(m1ToM2Queue, async (msg: Message | null) => {
        console.log(`Consumed from ${m1ToM2Queue} task: ${msg?.content.toString()}`);
        if (msg) {
            const json = JSON.parse(msg.content.toString());
            const result = await processTask(json.number);

            channel.sendToQueue(m2ToM1Queue, Buffer.from(JSON.stringify({
                number: result,
            })));
        }
    }, {
        noAck: true
    });
}

consumeTask();
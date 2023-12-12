import express from "express";
import client, {Channel, Connection, Message} from "amqplib";

const app = express();
app.use(express.json());

const m1ToM2Queue = 'm1-to-m2-queue';
const m2ToM1Queue = 'm2-to-m1-queue';
let connection: Connection;
let channel: Channel;

async function connectToAmqp() {
    connection = await client.connect(
        process.env.MSG_QUEUE_URL || "amqp://rabbitmq:5672/"
    );
    // Create a channel
    channel = await connection.createChannel();

    // Makes the queue available to the client
    await channel.assertQueue(m1ToM2Queue);
    await channel.assertQueue(m2ToM1Queue)
}

async function closeConnection() {
    await channel.close();
    await connection.close();
}

app.post("/process-number", async (req, res) => {
    await connectToAmqp();
    const data = JSON.parse(JSON.stringify(req.body));
    if (!data || typeof data.number !== "number") {
        return res.status(400).send('Invalid message payload received.');
    }

    console.log(`Request to process: ${data.number}`);

    const inputNumber = data.number;

    channel.sendToQueue(m1ToM2Queue, Buffer.from(JSON.stringify({number: inputNumber})));

    console.log(`Task sent to ${m1ToM2Queue}`);

    let result: number;
    await channel
        .consume(m2ToM1Queue, (msg: Message | null) => {
            console.log(`Consumed from ${m2ToM1Queue} object ${msg}`);
            if (msg) {
                result = JSON.parse(msg.content.toString()).number;
            }
            console.log(`result: ${result}`);
            closeConnection();
            return res.status(200).send(`${result}`);
        }, {
            noAck: true
        })
        .catch(err => {
            console.log(err);
            closeConnection();
            return res.status(500).send('Something went wrong.');
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `m1 service listening at http://localhost:${port}`);
});
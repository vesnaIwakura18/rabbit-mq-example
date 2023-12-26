# Getting started

To get the Node server running locally:

- Clone the repo `https://github.com/vesnaIwakura18/rabbit-mq-example.git`
- `npm install` to install all required dependencies (make sure that Node.js is installed on your machine)
- Make sure that your Docker application is running
- run `docker-compose up` in the core directory

## Dependencies

- [typescript](https://github.com/microsoft/TypeScript) - TypeScript is a superset of JavaScript that compiles to clean JavaScript output
- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [amqp](https://www.rabbitmq.com/getstarted.html) - Advanced Message Queuing Protocol

## Endpoints

- /process-number - POST - parameter: number (int)


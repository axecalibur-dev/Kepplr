import amqp from "amqplib";

class RabbitMQService {
  connect = async () => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_DEPLOYED);
      const channel = await connection.createChannel();

      const queue = process.env.SYSTEM_QUEUE;

      // Create a queue
      await channel.assertQueue(queue);

      console.log("Connected to RabbitMQ");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      console.log("Rabbit MQ Error occurred", error);
    }
  };
}

export default RabbitMQService;

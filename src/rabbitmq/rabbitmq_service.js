import amqp from "amqplib";

class RabbitMQService {
  connect = async () => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_DEPLOYED); // Replace with your connection URL
      const channel = await connection.createChannel();
      // const queue = process.env.SYSTEM_QUEUE;
      // Create a queue
      // await channel.assertQueue(queue);
      connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
      });

      // Do further setup, create channels, and start consuming messages here
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
    }
  };
}

export default RabbitMQService;

import amqp from "amqplib";
const queue_name = "system_queue";

class RabbitMQService {
  connectToRabbitMQ = async () => {
    try {
      const connection = await amqp.connect("amqp://localhost");
      const channel = await connection.createChannel();
      await channel.assertQueue(queue_name);

      await channel.consume(queue_name, (message) => {
        if (message !== null) {
          console.log("Message Received.");
          console.log(message.content.toString());
          console.log("Message Received.");

          channel.ack(message);
        }
      });

      console.log("Connected to Rabbit MQ.");
    } catch (error) {
      console.log("RMQ Error");
      console.log(error.message);
      console.log("RMQ Error");
    }
  };
}
export default RabbitMQService;

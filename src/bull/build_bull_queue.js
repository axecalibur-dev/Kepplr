import { Queue } from "bullmq";
import { redisOptions } from "../redis/redis";

export const build_queue = (queue_name) => {
  const myQueue = new Queue(queue_name, {
    connection: redisOptions(),
  });

  return myQueue;
};

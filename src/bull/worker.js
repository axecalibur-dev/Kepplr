import { Worker } from "bullmq";
import { redisOptions } from "../redis/redis";

export const create_worker = async (
  queue_name,
  function_instance,
  args,
  job_id,
) => {
  const worker = new Worker(
    queue_name,
    async (job) => {
      return await function_instance(args);
    },

    {
      connection: redisOptions(),
    },
  );

  console.log(`>> 🔄👷Workers Deployed for ${job_id}`);

  worker.on("completed", (job, result) => {
    console.log(
      `>> 🔄✅ Job with SysID ${job.id} has completed. The handler returned the following response : ${result}`,
    );
  });

  worker.on("failed", (job, err) => {
    console.log(
      `>> 🔄⭕ Job with SysID ${job.id} has failed with ${err.message}`,
    );
  });

  return worker;
};

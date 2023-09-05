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
      return await function_instance(job.data);
    },

    {
      limiter: {
        max: 1,
        duration: 10000,
      },
      concurrency: 10,
      connection: redisOptions(),
    },
  );

  console.log(`>> 🔄 👷 Workers Deployed for ${job_id}`);

  worker.on("error", (err) => {
    console.log(
      `🔄 ⚠️  Job with SysID ${job.id} has encountered an error. Error : ${err}`,
    );
  });

  worker.on("completed", async (job, result) => {
    await worker.close();
    console.log(
      `>> 🔄 ✅  Job with SysID ${job.id} has completed. The handler returned the following response : ${result}`,
    );
  });

  worker.on("failed", (job, err) => {
    console.log(
      `>> 🔄 ⭕  Job with SysID ${job.id} has failed with ${err.message}`,
    );
  });

  return worker;
};

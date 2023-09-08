import { Worker } from "bullmq";
import { redisOptions } from "../redis/redis";
import { TaskLogger } from "../models/task_logger";
import { TaskRegistry } from "./task_registry";
import { DataTypes } from "sequelize";

export const create_worker = async (
  queue_name,
  function_instance,
  args,
  job_id,
  job_name,
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

  const task = await TaskLogger.create({
    job_id: job_id,
    queue_name: queue_name,
    job_name: job_name,
    args: {
      arg: args,
    },
  });
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

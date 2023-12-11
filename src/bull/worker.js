import { Worker } from "bullmq";
import { redisOptions } from "../redis/redis";
import { TaskRegistry } from "./task_registry";
import { DataTypes } from "sequelize";
import { TaskLogger } from "../db/schema/taskLogger";
import TaskConstants from "../globals/constants/task_constants";

export const create_worker = async (
  queue_name,
  function_instance,
  args,
  job_id,
  job_name,
  registry_id,
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

  // const task = await TaskLogger.create({
  //   job_id: job_id,
  //   queue_name: queue_name,
  //   job_name: job_name,
  //   args: {
  //     arg: args,
  //   },
  // });
  console.log(`>> 🔄 👷 Workers Deployed for ${job_id}`);
  let task_result = TaskConstants.FIRED;
  let error_string = "";

  worker.on("error", (err) => {
    task_result = TaskConstants.FAILED;
    error_string = err;
    console.log(
      `🔄 ⚠️  Job with SysID ${job.id} has encountered an error. Error : ${err}`,
    );
  });

  worker.on("completed", async (job, result) => {
    await worker.close();
    task_result = TaskConstants.SUCCESS;
    error_string = "#NOERROR";

    console.log(
      `>> 🔄 ✅  Job with SysID ${job.id} has completed. The handler returned the following response : ${result}`,
    );
  });

  worker.on("failed", (job, err) => {
    task_result = TaskConstants.FAILED;
    error_string = err.message;
    console.log(
      `>> 🔄 ⭕  Job with SysID ${job.id} has failed with ${err.message}`,
    );
  });

  const task = await TaskLogger.findByIdAndUpdate(registry_id, {
    $set: {
      updated_at: Date.now(),
    },
  });
  return worker;
};

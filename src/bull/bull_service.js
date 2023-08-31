import { Queue, Job } from "bullmq";
import { Worker } from "bullmq";
import Utils from "../utils/utils";
import { Friends } from "../db/dbConnector";
import RedisClient from "../redis/redis_config";

const utils = new Utils();
class Bull {
  service = async () => {
    // RedisClient().set("OP", "PO");
    const va = {
      host: process.env.REDIS_URL_DEPLOYED,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PWD,
      port: 15104,
      db: process.env.REDIS_DB_DEPLOYED,
    };
    const myQueue = new Queue("myqueue", {
      connection: RedisClient(),
    });

    async function addJobs() {
      await myQueue.add("myJobName", { foo: "bar" });
      await myQueue.add("myJobName", { qux: "baz" });
    }

    await addJobs();

    const worker = new Worker(
      "myqueue",
      async (job) => {
        await job.updateProgress(42);

        // Optionally sending an object as progress
        await job.updateProgress({ foo: "bar" });
        console.log(job.data);
        console.log("RuNNING");

        // Do something with job
        return "some value";
      },
      {
        connection: va,
      },
    );

    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      console.log(`${job.id} has failed with ${err.message}`);
    });
  };
}
export default Bull;

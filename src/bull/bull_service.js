import { build_queue } from "./build_bull_queue";
import { create_worker } from "./worker";
import Utils from "../utils/utils";
const Util = new Utils();

class BullMessageQueueService {
  send_task = async (queue_name, job_name, function_instance, args) => {
    const job_id = Util.generate_system_job_id(queue_name, job_name);
    console.log(
      `>> 🔄 🚨 Task Received :: Queue Name : ${queue_name} || Job Name : ${job_name} || Args : ${JSON.stringify(
        args,
      )} || System Generated Job ID : ${job_id} || `,
    );
    const myQueue = build_queue(queue_name);
    await myQueue.add(job_name, args, {
      jobId: job_id,
      removeOnComplete: true,
    });
    await create_worker(queue_name, function_instance, args, job_id, job_name);
  };
}
export default BullMessageQueueService;

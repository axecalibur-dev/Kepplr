import CeleryClientConfig from "./celery_config";
const CeleryClient = new CeleryClientConfig();
import { createWorker } from "celery-node";

class CeleryWorkerService {
  send_task = (task_name, function_instance, args) => {
    const client = CeleryClient.get_celery_client();
    const result = client.sendTask(task_name, args);
    const worker = createWorker(
      process.env.RABBITMQ_DEPLOYED,
      process.env.RABBITMQ_DEPLOYED,
      // process.env.SYSTEM_QUEUE,
    );
    worker.register(task_name, () => function_instance(args));
    worker
      .start()
      .then((r) => {
        console.log(
          `|| Task Started :: Task Name :> ${task_name} Args :> ${args} ||`,
        );
      })
      .catch((err) => {
        console.log(
          `|| Task Started :: Task Name :> ${task_name} Args :> ${args} Error :> ${err} ||`,
        );
      });

    result
      .get()
      .then((data) => {
        console.log(
          `|| Task Completed :: Task Name :> ${task_name} Args :> ${args} Result :> ${data} ||`,
        );
      })
      .catch((err) => {
        console.log(
          `|| Send Task Result Retrieval Error :: Task Name :> ${task_name} Args :> ${args} Error :> ${err} ||`,
        );
      });
  };
}

export default CeleryWorkerService;

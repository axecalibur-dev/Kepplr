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
        console.log("Task Ongoing");
      })
      .catch((err) => {
        console.log("Task Error", err);
      });
  };
}

export default CeleryWorkerService;

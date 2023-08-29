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
      process.env.SYSTEM_QUEUE,
    );
    worker.register(task_name, () => function_instance(args));
    worker
      .start()
      .then(() => {
        console.log(
          `Celery Task Ongoing :: Task Name : > ${task_name} Args : > ${args}`,
        );
      })
      .catch((err) => {
        console.log(
          `Celery Task Error :: Task Name : > ${task_name} Args : > ${args} Error : > ${err}`,
        );
      });

    result
      .get()
      .then((data) => {
        console.log(
          `Celery Task Completed :: Task Name : > ${task_name} Args : > ${args} Result : > ${data}`,
        );
        client
          .disconnect()
          .then((r) => {
            console.log("Celery Connection Closed");
          })
          .catch((err) => {
            console.log(
              `Could not close celery connection with Error : ${err}`,
            );
          });
      })
      .catch((e) => {
        console.log(`Task Error : > ${e}`);
      });
  };
}

export default CeleryWorkerService;

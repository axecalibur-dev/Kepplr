import { createClient } from "celery-node";

class CeleryClientConfig {
  get_celery_client = () => {
    return createClient(
      process.env.RABBITMQ_DEPLOYED,
      process.env.RABBITMQ_DEPLOYED,
      process.env.SYSTEM_QUEUE,
    );
  };
}
export default CeleryClientConfig;

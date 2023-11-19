import express from "express";
const router = express.Router();
import AuthMiddleware from "../db/services/auth/auth_middleware";
import BullMessageQueueService from "../bull/bull_service";
import { RegisteredQueues } from "../bull/queues";
import { TaskRegistry } from "../bull/task_registry";
import SampleTasks from "../bull/tasks/sample_tasks";
import { express_limiter } from "../data/rate_limit";
import { TaskLogger } from "../models/task_logger";
import ReportingService from "../reports/report_service";
import CloudinaryService from "../cloudinary/cloudinary";
const Auth = new AuthMiddleware();

const Report = new ReportingService();

const BullTasks = new BullMessageQueueService();
const ST = new SampleTasks();

const Cloud = new CloudinaryService();

router.get("/health", Auth.auth, async (req, res) => {
  // console.log("Health Check");

  return res.status(200).send({
    healthCheck: "OK",
  });
});

router.post("/test_task", async (req, res) => {
  await BullTasks.send_task(
    RegisteredQueues.Fault_Tolerance,
    TaskRegistry.Sample_Db_Population,
    ST.sample_db_population_task,
    [req.body["records"]],
  );
  return res.status(200).send({
    status: "OK",
  });
});

router.get("/report", Auth.auth, async (req, res) => {
  // console.log("Health Check");
  const report = await Report.generate_user_report();
  return res.status(200).send({
    healthCheck: "OK",
  });
});

router.get("/upload", Auth.auth, async (req, res) => {
  // console.log("Health Check");
  const filePath = await Cloud.upload_to_cloudinary(req);
  console.log(filePath);
  return res.status(200).send({
    healthCheck: "filePath  ",
  });
});

export default router;

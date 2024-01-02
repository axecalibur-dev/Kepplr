import express from "express";
const router = express.Router();
import AuthMiddleware from "../db/services/auth/auth_middleware";
import BullMessageQueueService from "../bull/bull_service";
import { RegisteredQueues } from "../bull/queues";
import { TaskRegistry } from "../bull/task_registry";
import SampleTasks from "../bull/tasks/sample_tasks";
import { express_limiter } from "../data/rate_limit";
import ReportingService from "../reports/report_service";
import CloudinaryService from "../cloudinary/cloudinary";
import build from "../scripts/build";
import ScriptingService from "../scripts/build";
const Auth = new AuthMiddleware();

const Report = new ReportingService();

const BullTasks = new BullMessageQueueService();
const ST = new SampleTasks();

const Cloud = new CloudinaryService();

const Script = new ScriptingService();

router.get("/health", Auth.auth, async (req, res) => {
  // console.log("Health Check");

  return res.status(200).send({
    healthCheck: "OK",
  });
});

router.post("/populate", async (req, res) => {
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

router.post("/build", async (req, res) => {
  if (!req.body["emails"]) {
    return res.status(200).send({
      message: "Emails array not passed in body.",
      status: "Fail",
    });
  }
  const script = await Script.build(req);
  console.log("BUILD RESPONSE");
  console.log(script);
  return res.status(200).send({
    status: script,
  });
});

router.get("/report", Auth.auth, async (req, res) => {
  // console.log("Health Check");
  const report = await Report.generate_system_wide_report();
  return res.status(200).send({
    filePath: report,
  });
});

router.get("/upload", Auth.auth, async (req, res) => {
  // console.log("Health Check");
  const filePath = await Cloud.upload_to_cloudinary(req);
  return res.status(200).send({
    filePath: filePath,
  });
});

export default router;

import express from "express";
const router = express.Router();
import AuthMiddleware from "../db/services/auth/auth_middleware";
import CeleryWorkerService from "../celery/worker";
import AsyncTask from "../tasks/async_tasks";
const Auth = new AuthMiddleware();
const Celery = new CeleryWorkerService();
const Task = new AsyncTask();
router.get("/health", Auth.auth, async (req, res) => {
  return res.status(200).send({
    healthCheck: "OK",
  });
});

router.post("/test_task", async (req, res) => {
  Celery.send_task("sample_task", Task.sample_task, req.body["records"]);
  // MailService.mail();

  return res.status(200).send({
    endpoint: "OK",
  });
});

export default router;

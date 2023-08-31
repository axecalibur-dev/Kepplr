import express from "express";
const router = express.Router();
import AuthMiddleware from "../db/services/auth/auth_middleware";
const Auth = new AuthMiddleware();
router.get("/health", Auth.auth, async (req, res) => {
  return res.status(200).send({
    healthCheck: "OK",
  });
});

router.post("/test_task", async (req, res) => {
  // Celery.send_task("sample_task", Task.sample_task, req.body["records"]);
  return res.status(200).send({
    status: "OK",
  });
});

export default router;

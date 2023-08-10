import express from "express";
const router = express.Router();
import ConnectionTest from "../utils/connection_tests";
const Connection = new ConnectionTest();

router.post("/test", async (req, res) => {
  const param = req.query["key"];
  console.log(param);
  if (!param) {
    return res.send("Cannot use /test, api key not provided.");
  }

  if (String(param) !== process.env.TEST_API_KEY) {
    return res.send("Cannot use /test, Invalid API provided.");
  }

  const result = await Connection.test_connections();
  return res.send({
    test_result: result,
  });
});
// SignUp API

export default router;

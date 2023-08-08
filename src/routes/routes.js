import express from "express";
import ConnectionTest from "../utils/connection_tests";

const router = express.Router();

const Connection = new ConnectionTest();

router.post("/test", (req, res) => {
  const param = req.query["key"];
  if (!param) {
    res.send("Cannot use /test, api key not provided.");
  }

  console.log(Connection.test_connections());

  return res.send(String(Connection.test_connections()));
});
// SignUp API

export default router;

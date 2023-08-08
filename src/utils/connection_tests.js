import mongoose from "mongoose";
import { environment } from "../config/config";
import { createClient } from "redis";

const env = process.env.ENVIRONMENT;

class ConnectionTest {
  test_connections = async () => {
    let mongo = "";
    let redis = "";
    await mongoose
      .connect(environment[env].dbString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        mongo = "Atlas connection established ✅";
        console.log("Atlas connection established 💽");
      })
      .catch((error) => {
        mongo = `Mongo Connection Failed : Error > ${error}`;
        console.log("DB Connection Failed with Error ❌ : ");
        console.log(error);
        console.log("DB Connection Failed ❌ ");
      });

    return mongo;
  };
}

export default ConnectionTest;

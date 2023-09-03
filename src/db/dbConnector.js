import mongoose from "mongoose";
import { friendSchema } from "./schema/friendSchema.js";
import { taskPerformance } from "./schema/task_peformance_schema";

const env = process.env.NODE_ENV;
// const connectionString = environment[env].dbString;
// console.log(process.env.MONGO_INITDB_ROOT_PASSWORD);
// const connectionString = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-container:27017/?authSource=admin`;

const connectionString = `${process.env.MONGO_CONNECTION_PREFIX}://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@${process.env.MONGO_DB_IP}/${process.env.MONGO_CONNECT_SUFFIX}`;
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Atlas connection established 💽");
  })
  .catch((error) => {
    console.log("DB Connection Failed with Error ❌ : ");
    console.log(error);
    console.log("DB Connection Failed ❌ ");
    process.exit(0);
  });

const Friends = mongoose.model("Friends", friendSchema);
const TaskPerformance = mongoose.model("TaskPerformance", taskPerformance);

export { Friends, TaskPerformance };

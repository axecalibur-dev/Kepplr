import mongoose from "mongoose";
import { environment } from "../config/config.js";
import { friendSchema } from "./schema/friendSchema.js";

const env = process.env.ENVIRONMENT;
mongoose
  .connect(environment[env].dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Atlas connection established.");
  })
  .catch((error) => {
    console.log("DB Connection Failed with Error : ");
    console.log(error);
    console.log("DB Connection Failed");
  });

const Friends = mongoose.model("Friends", friendSchema);

export { Friends };

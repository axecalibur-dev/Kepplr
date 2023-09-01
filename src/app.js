import express from "express";
import GlobalConstants from "./globals/constants/global_constants";
import routes from "./routes/routes";

export const get_app = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(`${GlobalConstants.REST_Endpoint}`, routes);
  return app;
};

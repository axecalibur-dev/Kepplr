import dotenv from "dotenv";
dotenv.config();
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import { resolvers } from "./data/resolvers.graphql";
import typeDefs from "./data/schema.graphql";
import ExceptionResponseBuilder from "./Exceptions/exception_builder";
import SlackService from "./slack/slack_service";
const Slack = new SlackService();
const ApolloException = new ExceptionResponseBuilder();
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import HttpStatus from "http-status-codes";
import GlobalConstants from "./globals/constants/global_constants";
import { get_app } from "./app";
import mongoose from "mongoose";
const connectionString = `${process.env.MONGO_CONNECTION_PREFIX}://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@${process.env.MONGO_DB_IP}/${process.env.MONGO_CONNECT_SUFFIX}`;

async function startServer() {
  const app = get_app();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => {
      return ApolloException.throw_error_as_response(err);
    },
    // introspection: true,
    // playground: false,
  });
  await server.start();
  app.use(
    `${GlobalConstants.GraphQL_Endpoint}`,
    cors(),
    expressMiddleware(server, {
      context: async ({ req }) => req.headers,
    }),
  );

  app.set("trust proxy", (ip) => {
    if (ip === "127.0.0.1" || ip === "123.123.123.123")
      return true; // trusted IPs
    else return false;
  });
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
  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve),
  );
}
startServer()
  .then((result) => {
    console.log(
      `Kepplr is up and running, deployment at https://www.kepplr.xyz 🌐 `,
    );
    console.log(
      `Kepplr is up and running, Build Type : ${process.env.NODE_ENV}, GraphQL at http://localhost:${process.env.PORT}${GlobalConstants.GraphQL_Endpoint} 🌐 `,
    );
    console.log(
      `REST at http://localhost:${process.env.PORT}${GlobalConstants.REST_Endpoint} 🌐 `,
    );
    console.log();
  })
  .catch((err) => console.log(err));

Slack.send_to_slack(
  "Server Startup OK 🚀",
  `Server has started successfully of environment : ${process.env.NODE_ENV} ✅ `,
  HttpStatus.OK,
)
  .then((r) => {
    console.log("Slack running and communicating ✅ ");
  })
  .catch((err) => console.log("Slack failed ❌ ", err));

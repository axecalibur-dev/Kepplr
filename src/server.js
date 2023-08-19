import express from "express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { resolvers } from "./data/resolvers.graphql";
import typeDefs from "./data/schema.graphql";
import { PORT } from "./config/config";
import ExceptionResponseBuilder from "./Exceptions/exception_builder";
import SlackService from "./slack/slack_service";
const Slack = new SlackService();
const ApolloException = new ExceptionResponseBuilder();
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import routes from "./routes/routes";
import HttpStatus from "http-status-codes";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use("/rest", routes);

  const server = new ApolloServer({
    persistedQueries: false,
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({ req }) => {
      return req;
    },
    formatError: (error) => {
      return ApolloException.throw_response(error);
    },
  });
  await server.start();

  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

  // cronService.start();
  await new Promise((resolve, reject) => {
    httpServer.listen({ port: process.env.PORT }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
startServer()
  .then((result) =>
    console.log(
      `Graphql running , Build Type : ${process.env.NODE_ENV}, at http://localhost:${PORT}/graphql 🌐 `,
    ),
  )
  .catch((err) => console.log(err));

Slack.send_to_slack(
  "Server Startup 🚀",
  `Server has started successfully of type : ${process.env.NODE_ENV} ✅ `,
  HttpStatus.OK,
)
  .then((r) => {
    console.log("Slack running and communicating ✅ ");
    console.log("Slack Startup Notification Sent 🚨 ");
  })
  .catch((err) => console.log("Slack failed ❌ ", err));

import express from "express";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
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
import GlobalConstants from "./globals/constants/global_constants";

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(`${GlobalConstants.REST_Endpoint}`, routes);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => {
      return ApolloException.throw_error_as_response(err);
    },
  });
  await server.start();
  app.use(
    `${GlobalConstants.GraphQL_Endpoint}`,
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    expressMiddleware(server, {
      context: async ({ req }) => req.headers,
    }),
  );
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
}
startServer()
  .then((result) =>
    console.log(
      `Graphql up and running [STABLE] , Build Type : ${process.env.NODE_ENV}, at http://localhost:${PORT}${GlobalConstants.GraphQL_Endpoint} 🌐 `,
    ),
  )
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

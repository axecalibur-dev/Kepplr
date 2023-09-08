import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cors from "cors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import HttpStatus from "http-status-codes";
import ExceptionResponseBuilder from "./Exceptions/exception_builder";
import SlackService from "./slack/slack_service";
import GlobalConstants from "./globals/constants/global_constants";
import typeDefs from "./data/schema.graphql";
import { resolvers } from "./data/resolvers.graphql";
import { expressMiddleware } from "@apollo/server/express4";
import { connect_to_databases } from "./db/connection";
import { get_app } from "./app";

const Slack = new SlackService();
const ApolloException = new ExceptionResponseBuilder();
const expressApp = get_app();

async function setupApolloServer(httpServer) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => ApolloException.throw_error_as_response(err),
  });
  await server.start();
  return server;
}

async function startServer() {
  const httpServer = http.createServer(expressApp);

  expressApp.use(
    `${GlobalConstants.GraphQL_Endpoint}`,
    cors(),
    expressMiddleware(await setupApolloServer(httpServer), {
      context: async ({ req }) => req.headers,
    }),
  );

  expressApp.set("trust proxy", (ip) => {
    if (ip === "127.0.0.1" || ip === "123.123.123.123") {
      return true; // trusted IPs
    } else {
      return false;
    }
  });

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(
      `Kepplr is up and running, deployment at https://www.kepplr.xyz 🌐`,
    );
    console.log(
      `Kepplr ( GraphQL ) :: Build Type: ${process.env.NODE_ENV} :: at http://localhost:${process.env.PORT}${GlobalConstants.GraphQL_Endpoint} 🌐`,
    );
    console.log(
      `Kepplr ( REST ) :: Build Type: ${process.env.NODE_ENV} :: at http://localhost:${process.env.PORT}${GlobalConstants.REST_Endpoint} 🌐`,
    );
  });

  await connect_to_databases();
}

startServer()
  .then(() => {
    Slack.send_to_slack(
      "Server Startup OK 🚀",
      `Server has started successfully of environment: ${process.env.NODE_ENV} ✅ `,
      HttpStatus.OK,
    )
      .then(() => {
        console.log("Slack running and communicating. ✅ ");
      })
      .catch((err) => {
        console.error("Slack failed ❌", err);
      });
  })
  .catch((err) => {
    console.error("Server startup failed ❌", err);
  });

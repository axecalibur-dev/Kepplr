import express from "express";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./data/resolvers.graphql.js";
import typeDefs from "./data/schema.graphql.js";
import { PORT } from "./config/config.js";
import { cronJob_Night } from "./crons/daily_tasks.js";
import cronstrue from "cronstrue";
import ExceptionResponseBuilder from "./Exceptions/exception_builder.js";
import HttpStatus from "http-status-codes";
import SlackService from "./slack/slack_service.js";
const Slack = new SlackService();
const ApolloException = new ExceptionResponseBuilder();
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return req;
    },
    formatError: (error) => {
      return ApolloException.throw_response(error);
    },
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });
  app.get("/", (req, res) => {
    console.log("Apollo GraphQL x Express server is ready");
    res.send(`Apollo GraphQL x Express server is ready.`);
  });

  app.listen({ port: PORT }, () => {
    console.log(
      `Graphql Server running at http://localhost:${PORT}${server.graphqlPath}`,
    );
  });

  try {
    cronJob_Night.start();
    console.log(
      `Kabadiwala Service Scheduled .... ${cronstrue.toString(
        process.env.CRON_SCHEDULE,
      )}`,
    );
  } catch (err) {
    console.log("CRON ERROR : ");
    console.log(err);
  }
}

startServer()
  .then((result) => console.log(`Server running`))
  .catch((err) => console.log(err));

await Slack.send_to_slack(
  "Server Startup 🚀",
  `Server has started successfully at ${process.env.DEPLOYMENT_SOURCE} ✅`,
  HttpStatus.OK,
)
  .then((r) => console.log("Slack Sent"))
  .catch((err) => console.log(err));

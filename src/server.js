import express from "express";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./data/resolvers.graphql";
import typeDefs from "./data/schema.graphql";
import { PORT } from "./config/config";
import { cronJob_Night } from "./crons/daily_tasks";
import cronstrue from "cronstrue";
import ExceptionResponseBuilder from "./Exceptions/exception_builder";
import HttpStatus from "http-status-codes";
import SlackService from "./slack/slack_service";
const Slack = new SlackService();
// import RabbitMQService from "./mqservices/rabbitmq_service";
const ApolloException = new ExceptionResponseBuilder();
// const RabbitMQ = new RabbitMQService();
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
    console.log("Cron Jobs Initiated");
  } catch (err) {
    console.log("Cron Job Exception");
    console.log("CRON ERROR : ");
    console.log(err);
  }

  // await RabbitMQ.connectToRabbitMQ();
}

startServer()
  .then((result) => console.log(`Server running`))
  .catch((err) => console.log(err));

Slack.send_to_slack(
  "Server Startup",
  `Server has started successfully at ${process.env.DEPLOYMENT_SOURCE}.`,
  HttpStatus.OK,
)
  .then((r) => console.log("Slack Sent"))
  .catch((err) => console.log(err));

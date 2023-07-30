import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './data/resolvers.graphql';
import  typeDefs  from './data/schema.graphql';
import { PORT } from './config/config';
import {cronJob} from "./crons/daily_tasks";

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });
    app.get('/', (req, res) => {
        console.log("Apollo GraphQL Express server is ready. This is REST Endpoint, currently under build.");
        res.send(`Apollo GraphQL x Express server is ready. This is REST Endpoint, currently under development. Graphql Server running at http://localhost:${PORT}${server.graphqlPath}`)
    });

    app.listen({ port: PORT }, () => {
        console.log(`Graphql Server running at http://localhost:${PORT}${server.graphqlPath}`);
        console.log("REST Endpoint at localhost");
    });

    try {
        cronJob.start()
        console.log("Kabadiwala incoming....")
        console.log("Cron Initiated")
    }

    catch (err) {
        console.log("Cron Job Exception")
        console.log("CRON ERROR : ")
        console.log(err)
    }


}

startServer().then(r => console.log("Server running")).catch((err=> console.log(err)))
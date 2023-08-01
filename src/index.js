import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {resolvers} from './data/resolvers.graphql';
import typeDefs from './data/schema.graphql';
import {PORT} from './config/config';
import {cronJob_Night } from "./crons/daily_tasks";

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers ,context: ({ req }) => {
            return {
                authorization: req.headers.authorization,
                origin : req.headers.origin,
                user_agent : req.headers['user-agent'],
                content_type : req.headers['content-type'],
            };
        },
    });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });
    app.get('/', (req, res) => {
        console.log("Apollo GraphQL x Express server is ready");
        res.send(`Apollo GraphQL x Express server is ready.`)
    });

    app.listen({ port: PORT }, () => {
        console.log(`Graphql Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });

    try {
        cronJob_Night.start()
        console.log("Kabadiwala Service Scheduled .... ( 11 PM)")
        console.log("Cron Jobs Initiated")
    }

    catch (err) {
        console.log("Cron Job Exception")
        console.log("CRON ERROR : ")
        console.log(err)
    }
}

startServer().then(r => console.log("Server running")).catch((err=> console.log(err)))
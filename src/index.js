import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './data/resolvers.graphql';
import { typeDefs } from './data/schema.graphql';
import { PORT } from './config/config';

async function startServer() {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });
    app.get('/', (req, res) => {
        console.log("Apollo GraphQL Express server is ready");
        res.send("GQL Ready")
    });

    app.listen({ port: PORT }, () =>
        console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`)
    );
}

startServer().then(r => console.log("Server running")).catch((err=> console.log(err)))
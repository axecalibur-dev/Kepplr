import dotenv from 'dotenv'
dotenv.config()
export const PORT = process.env.PORT
export const environment = {
    development: {
        "serverURL": `http://localhost:${PORT}`,
        "serverURL(REST)": `http://localhost:${PORT}`,
        "serverURL(GraphQL)": `http://localhost:${PORT}/graphql`,
        "dbString": process.env.MONGO_SRV
    }
}
console.log("Environment Configuration")
console.log(environment.development)
console.log("Environment Configuration")

import dotenv from 'dotenv'
dotenv.config()
export const PORT = 8000;
export const environment = {
    development : {
        serverURL : `http://localhost:${PORT}`,
        dbString : process.env.MONGO_SRV
    }
console.log("Environment Configuration")
console.log(environment)
console.log("Environment Configuration")

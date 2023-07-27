import dotenv from 'dotenv'
dotenv.config()
export const PORT = process.env.PORT
export const environment = {
    development: {
        "dbString": process.env.MONGO_SRV
    },

    production : {

    }
}
console.log("Environment Configuration")
console.log(environment.development)
console.log("Environment Configuration")

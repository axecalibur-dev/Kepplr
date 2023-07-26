export const PORT = 8000;
export const environment = {
    development : {
        serverURL : `http://localhost:${PORT}`,
        dbString : "mongodb+srv://jaibhattwebdev:0wuhPg7mFgwg8iKh@cluster0.32at8ur.mongodb.net/?retryWrites=true&w=majority"
    }
}
console.log("Environment Configuration")
console.log(environment)
console.log("Environment Configuration")
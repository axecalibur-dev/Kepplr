import redis, { createClient } from "redis";

const client = createClient({
  socket: { host: process.env.REDIS_URL_DEPLOYED, port: 15104 },
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PWD,
});

client
  .connect()
  .then((r) => {})
  .catch((err) => {
    console.log("Attempt to Redis Connection failed", err);
  });
client.on("connect", () => console.log("Redis Client Connected ✅ "));
client.on("error", (err) => console.log("Redis Client Error", err));

const RedisClient = () => {
  return client;
};

export default RedisClient;

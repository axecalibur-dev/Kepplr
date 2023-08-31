import { createClient } from "redis";

export const redisService = async () => {
  const client = createClient({
    username: process.env.REDIS_USER, // use your Redis user. More info https://redis.io/docs/management/security/acl/
    password: process.env.REDIS_PWD, // use your password here
    database: process.env.REDIS_DB_DEPLOYED,
    socket: {
      host: process.env.REDIS_URL_DEPLOYED,
      port: process.env.REDIS_PORT,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("ready", () => console.log("Redis Client Ready"));
  client.on("connect", () => console.log("Redis Client Connected"));
  await client.connect();

  return client;
};

export const redisOptions = () => {
  const va = {
    host: process.env.REDIS_URL_DEPLOYED,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PWD,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB_DEPLOYED,
  };

  return va;
};

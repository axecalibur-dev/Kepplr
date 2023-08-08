import { createClient } from "redis";

class RedisService {
  connect = async () => {
    const client = await createClient({
      socket: {
        host: process.env.REDIS_URL_DEPLOYED,
        port: 15104,
      },
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PWD,
    });

    client
      .connect()
      .then(() => {
        // console.log("");
      })
      .catch((err) => console.log(err));

    client.on("connect", (err) => console.log("Redis Connected 💽 "));
    client.on("ready", (err) => console.log("Redis Ready ✅ "));
    client.on("error", (err) => console.log("Redis Server Error ❌ ", err));

    return client;
  };
}

export default RedisService;

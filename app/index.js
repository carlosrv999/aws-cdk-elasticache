import express from "express";
import { createClient } from "redis";
const app = express();
const port = 3000;
const redis_host = process.env.REDIS_HOST;
const redis_port = process.env.REDIS_PORT;

const connectRedis = async () => {
  const client = createClient({ url: `redis://${redis_host}:${redis_port}` });
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  await client.set("key", "value");
  const value = await client.get("key");
  console.log(value);
  await client.disconnect();
};

app.get("/", async (req, res) => {
  res.send("Hello World!");
  connectRedis();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

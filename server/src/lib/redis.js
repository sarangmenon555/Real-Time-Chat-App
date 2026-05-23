const Redis = require("ioredis");

let client;

module.exports = async function connectRedis() {
  client = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  client.on("connect", () => console.log("Redis connected"));
  client.on("error", (err) => console.error("Redis error:", err.message));
  return client;
};

module.exports.getRedis = () => client;

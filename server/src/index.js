require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");
const connectMongo = require("./lib/mongo");
const connectRedis = require("./lib/redis");
const authRoutes = require("./routes/auth");
const channelRoutes = require("./routes/channels");
const messageRoutes = require("./routes/messages");
const uploadRoutes = require("./routes/upload");
const registerSocketHandlers = require("./socket");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", ts: Date.now() }));

registerSocketHandlers(io);

const PORT = process.env.PORT || 4000;

(async () => {
  await connectMongo();
  await connectRedis();
  httpServer.listen(PORT, () => {
    console.log("Relay server running on port " + PORT);
  });
})();

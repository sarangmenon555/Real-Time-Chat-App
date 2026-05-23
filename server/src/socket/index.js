const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");

const onlineUsers = new Map();

module.exports = function registerSocketHandlers(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "relay_secret");
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const { uid, name } = socket.user;

    onlineUsers.set(uid, { socketId: socket.id, name, status: "online" });

    await User.findOneAndUpdate({ uid }, { status: "online", lastSeen: new Date() });

    io.emit("presence:update", Object.fromEntries(onlineUsers));

    socket.on("channel:join", (channelId) => {
      socket.join(channelId);
    });

    socket.on("channel:leave", (channelId) => {
      socket.leave(channelId);
    });

    socket.on("message:send", async (data, ack) => {
      try {
        const { channelId, text, mediaUrl, mediaType } = data;
        const message = await Message.create({
          channelId,
          userId: uid,
          userName: name,
          text: text || "",
          mediaUrl: mediaUrl || "",
          mediaType: mediaType || "",
          type: mediaUrl ? "media" : "text",
        });
        const payload = message.toObject();
        io.to(channelId).emit("message:new", payload);
        if (typeof ack === "function") ack({ ok: true, message: payload });
      } catch (err) {
        if (typeof ack === "function") ack({ ok: false, error: err.message });
      }
    });

    socket.on("typing:start", ({ channelId }) => {
      socket.to(channelId).emit("typing:update", { userId: uid, name, typing: true });
    });

    socket.on("typing:stop", ({ channelId }) => {
      socket.to(channelId).emit("typing:update", { userId: uid, name, typing: false });
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(uid);
      await User.findOneAndUpdate({ uid }, { status: "offline", lastSeen: new Date() });
      io.emit("presence:update", Object.fromEntries(onlineUsers));
    });
  });
};

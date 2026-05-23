const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  text: { type: String, default: "" },
  mediaUrl: { type: String, default: "" },
  mediaType: { type: String, enum: ["", "image", "file"], default: "" },
  type: { type: String, enum: ["text", "media", "system"], default: "text" },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);

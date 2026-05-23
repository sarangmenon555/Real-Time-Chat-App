const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  members: [{ type: String, ref: "User" }],
  createdBy: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Channel", channelSchema);

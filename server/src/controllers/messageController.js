const Message = require("../models/Message");
const Channel = require("../models/Channel");

exports.getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before;
    const query = { channelId };
    if (before) query.createdAt = { $lt: new Date(before) };
    const messages = await Message.find(query).sort({ createdAt: -1 }).limit(limit);
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const { channelId, text, mediaUrl, mediaType } = req.body;
    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    const message = await Message.create({
      channelId,
      userId: req.user.uid,
      userName: req.user.name,
      text,
      mediaUrl: mediaUrl || "",
      mediaType: mediaType || "",
      type: mediaUrl ? "media" : "text",
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Channel = require("../models/Channel");

exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: 1 });
    if (channels.length === 0) {
      const defaults = ["general", "design", "engineering", "random"];
      const created = await Channel.insertMany(defaults.map(name => ({ name, createdBy: "system", members: [] })));
      return res.json(created);
    }
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Channel.findOne({ name });
    if (existing) return res.status(400).json({ error: "Channel already exists" });
    const channel = await Channel.create({ name, description, createdBy: req.user.uid });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

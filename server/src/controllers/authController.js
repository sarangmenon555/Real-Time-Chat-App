const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });
    const uid = uuidv4();
    const user = await User.create({ uid, email, name });
    const token = jwt.sign({ uid, email, name, id: user._id }, process.env.JWT_SECRET || "relay_secret", { expiresIn: "7d" });
    res.json({ token, user: { uid, email, name, id: user._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, name } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const uid = uuidv4();
      user = await User.create({ uid, email, name: name || email.split("@")[0] });
    }
    const token = jwt.sign({ uid: user.uid, email: user.email, name: user.name, id: user._id }, process.env.JWT_SECRET || "relay_secret", { expiresIn: "7d" });
    res.json({ token, user: { uid: user.uid, email: user.email, name: user.name, id: user._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

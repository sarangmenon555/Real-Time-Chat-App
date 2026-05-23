const mongoose = require("mongoose");

module.exports = async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/relay");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

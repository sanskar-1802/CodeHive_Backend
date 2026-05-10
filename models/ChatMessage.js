const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: String,
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", schema);
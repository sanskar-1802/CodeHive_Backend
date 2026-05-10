const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  host: String,
  participants: [
    {
      socketId: String,
      username: String,
    },
  ],
  language: { type: String, default: "javascript" },
  currentCode: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);
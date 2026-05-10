const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: String,
  code: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CodeHistory", schema);
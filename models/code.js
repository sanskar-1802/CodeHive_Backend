const mongoose = require("mongoose");

const codeSchema = new mongoose.Schema({

  roomId: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  language: {
    type: String,
  },

  username: {
    type: String,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model(
  "Code",
  codeSchema
);
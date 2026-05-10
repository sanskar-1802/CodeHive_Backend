const CodeHistory = require("../models/CodeHistory");
const Room = require("../models/Room");

exports.saveCode = async (req, res) => {
  const { roomId, code } = req.body;

  await CodeHistory.create({ roomId, code });

  await Room.findOneAndUpdate({ roomId }, { currentCode: code });

  res.json({ msg: "Saved" });
};

exports.getHistory = async (req, res) => {
  const history = await CodeHistory.find({
    roomId: req.params.roomId,
  }).sort({ timestamp: -1 });

  res.json(history);
};
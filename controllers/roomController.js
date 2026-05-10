const Room = require("../models/Room");
const { generateRoomId } = require("../utils/generateId");

exports.createRoom = async (req, res) => {
  const { username } = req.body;

  const roomId = generateRoomId();

  const room = await Room.create({
    roomId,
    host: username,
    participants: [],
  });

  res.json(room);
};

exports.joinRoom = async (req, res) => {
  const { roomId } = req.body;

  const room = await Room.findOne({ roomId });

  if (!room) return res.status(404).json({ msg: "Room not found" });

  res.json(room);
};

exports.getRoom = async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });

  if (!room) return res.status(404).json({ msg: "Room not found" });

  res.json(room);
};
// ✅ GET USER ROOMS
exports.getUserRooms = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ msg: "Username required" });
    }

    const rooms = await Room.find({ host: username });

    res.json(rooms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching rooms" });
  }
};
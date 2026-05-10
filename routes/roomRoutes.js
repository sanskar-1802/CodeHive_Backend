const express = require("express");
const router = express.Router();
const {
  createRoom,
  joinRoom,
  getRoom,
  getUserRooms,
} = require("../controllers/roomController");

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/user", getUserRooms); 
router.get("/:roomId", getRoom);

module.exports = router;
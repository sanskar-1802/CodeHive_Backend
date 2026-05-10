const Room = require("../models/Room");
const ChatMessage = require("../models/ChatMessage");

const users = {};

exports.initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ✅ JOIN ROOM
    socket.on("join-room", async ({ roomId, username }) => {
      try {
        socket.join(roomId);

        users[socket.id] = { roomId, username };

        let room = await Room.findOne({ roomId });

        if (!room) return;

        // ✅ REMOVE duplicate user if already exists
        room.participants = room.participants.filter(
          (p) => p.username !== username
        );

        // ✅ ADD USER
        room.participants.push({
          socketId: socket.id,
          username,
        });

        await room.save();

        // ✅ SEND CURRENT CODE TO NEW USER
        socket.emit("code-update", room.currentCode || "");

        // ✅ SEND USERS LIST TO EVERYONE
        io.to(roomId).emit("user-joined", room.participants);

      } catch (err) {
        console.log("Join error:", err);
      }
    });

    // ✅ CODE CHANGE
    socket.on("code-change", async ({ roomId, code }) => {
      try {
        // broadcast to others
        socket.to(roomId).emit("code-update", code);

        // ✅ SAVE CODE IN DB
        await Room.findOneAndUpdate(
          { roomId },
          { currentCode: code }
        );
      } catch (err) {
        console.log("Code error:", err);
      }
    });

    // ✅ CURSOR MOVE
    socket.on("cursor-move", ({ roomId, cursor }) => {
      socket.to(roomId).emit("cursor-update", {
        socketId: socket.id,
        cursor,
      });
    });

    // ✅ CHAT
    socket.on("chat-message", async ({ roomId, message, sender }) => {
      try {
        await ChatMessage.create({ roomId, message, sender });

        io.to(roomId).emit("chat-update", { message, sender });
      } catch (err) {
        console.log("Chat error:", err);
      }
    });

    // ✅ VOICE SIGNAL
    socket.on("voice-signal", ({ roomId, data }) => {
      socket.to(roomId).emit("voice-signal", data);
    });

    // ✅ DISCONNECT
    socket.on("disconnect", async () => {
      try {
        const user = users[socket.id];
        if (!user) return;

        const { roomId, username } = user;

        const room = await Room.findOne({ roomId });

        if (room) {
          // remove user
          room.participants = room.participants.filter(
            (p) => p.socketId !== socket.id
          );

          await room.save();

          io.to(roomId).emit("user-left", room.participants);
        }

        delete users[socket.id];

        console.log("User disconnected:", username);
      } catch (err) {
        console.log("Disconnect error:", err);
      }
    });
  });
};
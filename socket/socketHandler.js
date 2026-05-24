const Room = require("../models/Room");
const ChatMessage = require("../models/ChatMessage");

const users = {};

exports.initSocket = (server) => {

  const io = require("socket.io")(server, {

    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },

    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {

    console.log("✅ User connected:", socket.id);

    // =========================
    // JOIN ROOM
    // =========================
    socket.on("join-room", async ({ roomId, username }) => {

      try {

        socket.join(roomId);

        users[socket.id] = {
          roomId,
          username,
        };

        const room = await Room.findOne({ roomId });

        if (!room) {
          console.log("❌ Room not found");
          return;
        }

        // remove duplicate participant
        room.participants = room.participants.filter(
          (p) => p.username !== username
        );

        // add new participant
        room.participants.push({
          socketId: socket.id,
          username,
        });

        await room.save();

        console.log(
          `✅ ${username} joined room ${roomId}`
        );

        // send current code to new user
        socket.emit(
          "code-update",
          room.currentCode || ""
        );

        // send updated users list
        io.to(roomId).emit(
          "user-joined",
          room.participants
        );

      } catch (err) {

        console.log(
          "❌ Join room error:",
          err.message
        );
      }
    });

    // =========================
    // CODE CHANGE
    // =========================
    socket.on("code-change", async ({ roomId, code }) => {

      try {

        // send updated code to others
        socket.to(roomId).emit(
          "code-update",
          code
        );

        // save latest code
        await Room.findOneAndUpdate(
          { roomId },
          { currentCode: code }
        );

      } catch (err) {

        console.log(
          "❌ Code sync error:",
          err.message
        );
      }
    });

    // =========================
    // CHAT
    // =========================
    socket.on(
      "chat-message",
      async ({ roomId, message, sender }) => {

        try {

          await ChatMessage.create({
            roomId,
            message,
            sender,
          });

          io.to(roomId).emit(
            "chat-update",
            {
              message,
              sender,
            }
          );

        } catch (err) {

          console.log(
            "❌ Chat error:",
            err.message
          );
        }
      }
    );

    // =========================
    // CURSOR TRACKING
    // =========================
    socket.on(
      "cursor-move",
      ({ roomId, cursor }) => {

        socket.to(roomId).emit(
          "cursor-update",
          {
            socketId: socket.id,
            cursor,
          }
        );
      }
    );

    // =========================
    // VOICE SIGNAL
    // =========================
    socket.on(
      "voice-signal",
      ({ roomId, data }) => {

        socket.to(roomId).emit(
          "voice-signal",
          data
        );
      }
    );

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", async () => {

      try {

        const user = users[socket.id];

        if (!user) return;

        const { roomId, username } = user;

        const room = await Room.findOne({
          roomId,
        });

        if (room) {

          room.participants =
            room.participants.filter(
              (p) =>
                p.socketId !== socket.id
            );

          await room.save();

          io.to(roomId).emit(
            "user-left",
            room.participants
          );
        }

        delete users[socket.id];

        console.log(
          `❌ ${username} disconnected`
        );

      } catch (err) {

        console.log(
          "❌ Disconnect error:",
          err.message
        );
      }
    });
  });
};
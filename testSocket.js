const io = require("socket.io-client");

const socket = io("http://localhost:5000");

const ROOM_ID = "Y7Se0zmH";

// join room
socket.emit("join-room", {
  roomId: ROOM_ID,
  username: "User_" + Math.floor(Math.random() * 100)
});

// USERS
socket.on("user-joined", (users) => {
  console.log("Users in room:", users);
});

// CODE
socket.on("code-update", (code) => {
  console.log("Received Code:", code);
});

setTimeout(() => {
  socket.emit("code-change", {
    roomId: ROOM_ID,
    code: "console.log('Hello from user')"
  });
}, 3000);

// CHAT
socket.on("chat-update", (data) => {
  console.log("Chat:", data);
});

setTimeout(() => {
  socket.emit("chat-message", {
    roomId: ROOM_ID,
    message: "Hello from user",
    sender: "User"
  });
}, 2000);

// CURSOR
socket.on("cursor-update", (cursor) => {
  console.log("Cursor:", cursor);
});

setTimeout(() => {
  socket.emit("cursor-move", {
    roomId: ROOM_ID,   // ✅ FIXED
    cursor: { line: 2, ch: 10 }
  });
}, 4000);
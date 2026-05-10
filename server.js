require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");

const roomRoutes = require("./routes/roomRoutes");
const codeRoutes = require("./routes/codeRoutes");
const authRoutes = require("./routes/authRoutes");

const { initSocket } = require("./socket/socketHandler");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

console.log("🚀 SERVER STARTING...");

// create server
const server = http.createServer(app);

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/code", codeRoutes);

// socket
initSocket(server);

// error middleware (ALWAYS LAST)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ✅ CONNECT DB THEN START SERVER
const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("❌ Server startup error:", err);
  }
};

startServer();
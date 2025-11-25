import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";

import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import friendRoute from "./routes/friendshipRoute.js";

dotenv.config();

// ---------------- SERVER SETUP ----------------
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT],
    credentials: true,
  })
);

// ---------------- DATABASE ----------------
connectDB();

// ---------------- ROUTES ----------------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/friend", friendRoute);

// ---------------- SOCKETS ----------------


export const userSocketMap = {};   // <-- saves userId → socketId

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const getOnlineUsers = () => Object.keys(userSocketMap);

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Auto-registration using query
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🔵 User ${userId} registered (query)`);

    io.emit("getOnlineUsers", getOnlineUsers());
  }

  // Manual register event
  socket.on("register", (uid) => {
    if (uid) {
      userSocketMap[uid] = socket.id;
      console.log(`🟢 User ${uid} registered (event)`);

      io.emit("getOnlineUsers", getOnlineUsers());
    }
  });

  // Disconnect handler
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    for (const uid in userSocketMap) {
      if (userSocketMap[uid] === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }

    io.emit("getOnlineUsers", getOnlineUsers());
  });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

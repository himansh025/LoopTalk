// socket/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
  import dotenv from "dotenv"
  dotenv.config()
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`${process.env.CLIENT}`],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // {userId: socketId}

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Handle user registration
  socket.on("register", (userId) => {
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`User ${userId} registered with socket ${socket.id}`);
      
      // Emit online users to all clients
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    // Remove user from online users
    for (const userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    // Update online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
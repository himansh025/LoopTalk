// src/socket.ts
import { io, Socket } from "socket.io-client";
import { initSocketListeners } from "./socketListeners"; // <-- ADD THIS
import { CloudCog } from "lucide-react";

// const apiUrl: string = import.meta.env.VITE_API_URL||"http://localhost:5000";
const socketurl: string = import.meta.env.VITE_SOCKET_API_URL||"http://localhost:5000";

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
          console.log("fck")
          console.log("socket",userId)
    if (socket) return socket;

    socket = io(socketurl, {
        query: { userId }
    });

    socket.on("connect", () => {
        console.log("✅ Connected to server");
        socket?.emit("register", userId);

        // IMPORTANT: start listening and dispatching to Redux
        initSocketListeners();   // <-- ADD THIS LINE
    });

    socket.on("disconnect", () => {
        console.log("❌ Disconnected from server");
    });

    return socket;
};

export const getSocket = () => socket;
export const closeSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

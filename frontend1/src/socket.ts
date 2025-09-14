// src/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;


export const initSocket = (userId: string) => {
    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("✅ Connected to server");
        socket?.emit("register", userId);
    });

    socket.on("disconnect", () => {
        console.log("❌ Disconnected from server");
    });

    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

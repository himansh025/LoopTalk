// src/socket.ts
import { io, Socket } from "socket.io-client";

const apiUrl:string = import.meta.env.VITE_API_URL;
console.log(apiUrl);
const socketurl:string = import.meta.env.VITE_SOCKET_API_URL;
console.log(socketurl);
let socket: Socket | null = null;


export const initSocket = (userId: string) => {
    socket = io(socketurl);

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

import { setOnlineUsers } from "./store/onlineUsersSlice";
import  store  from "./store/store";
import { getSocket } from "./socket";

export const initSocketListeners = () => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("getOnlineUsers", (users: string[]) => {
    store.dispatch(setOnlineUsers(users));
  });
};

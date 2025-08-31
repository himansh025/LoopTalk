import { Routes, Route, BrowserRouter } from "react-router-dom";
import {  useAppSelector } from "./hooks/hooks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authenticated from "./components/Authenticated";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/Logout";
import Layout from "./components/Layout";
import Profile from "./pages/HomePage";
import OnlineUser from "./components/OnineUser";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
let socket: Socket;

function App() {
  // const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState<String[]>([]);

  useEffect(() => {
    if (user?.id) {
      // Initialize socket connection
      socket = io("http://localhost:3000");
      
      // Register user when connected
        socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit("register", user.id);
      });
      
      // Listen for online users updates
      socket.on("getOnlineUsers", (users:String[]) => {
          console.log("Online users updated:", users);
        setOnlineUsers(users);
      });
      
      // Listen for new messages
      socket.on("newMessage", (message) => {
        // Handle new incoming messages
        console.log("New message received:", message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user?.id]);

 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          {/* authenticated routes */}
          <Route element={<Authenticated />}>
            <Route index path="/" element={<HomePage />} />
            <Route path="/logout" element={<LogoutButton />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/online" element={<OnlineUser  />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { socket };

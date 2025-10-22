import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useAppSelector } from "./hooks/hooks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authenticated from "./components/Authenticated";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/Logout";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import OnlineUser from "./components/OnineUser";
import { useEffect } from "react";
import { initSocket } from "./socket";
import { ToastContainer } from "react-toastify";

function App() {
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (user?.id) {
            const socket = initSocket(user.id);

            socket.on("newMessage", (message) => {
                console.log("💬 New message received:", message);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [user?.id]);

    return (
        <BrowserRouter>
        <div>

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Signup />} />

                    {/* authenticated routes */}
                    <Route element={<Authenticated />}>
                        <Route index path="/" element={<HomePage />} />
                        <Route path="/logout" element={<LogoutButton />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/online" element={<OnlineUser />} />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer/>
        </div>
        </BrowserRouter>
    );
}

export default App;

import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authenticated from "./components/Authenticated";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/Logout";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import { useEffect, useState } from "react";
import { initSocket, closeSocket } from "./socket";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "./config/apiconfig";
import { login } from "./store/authSlicer";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "./components/Loader";
import Explore from "./pages/Explore";
import NetworkGraph from "./pages/NetworkGraph";

function App() {
    const { user } = useSelector((state: any) => state.auth);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const userId = user?._id || user?.id;

    useEffect(() => {
        if (userId) {
            const socket = initSocket(userId);

            socket.on("newMessage", () => {
            });

            return () => {
                closeSocket();
            };
        }
    }, [userId]);

    const token = localStorage.getItem("token")
    useEffect(() => {
        if (user && token) navigate("/")


        if (token) {
            // console.log("token", token)
            const getUserProfile = async () => {
                try {
                    setLoading(true)
                    const { data } = await axiosInstance.get("/user/me");
                    // console.log(data)
                    dispatch(login({ user: data }))
                    navigate("/");

                } catch (error: any) {
                    // console.log(error?.response);
                    if (error?.response.status === 401) {
                        localStorage.removeItem("token")
                    }
                    toast.error(error?.response?.data?.message || " something went wrong")
                } finally {
                    setLoading(false)
                }

            };
            getUserProfile()
        }
    }, [token]);

    if (loading) {
        return <Loader />
    }
    return (

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
                        <Route path="/network" element={<NetworkGraph />} />
                        <Route path="/explore" element={< Explore />} />
                        <Route path="/user/:userId" element={<UserProfile />} />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer />
        </div>

    );
}

export default App;

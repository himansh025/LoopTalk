import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authenticated from "./components/Authenticated";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/Logout";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import OnlineUser from "./components/OnlineUser";
import NetworkGraph from "./pages/NetworkGraph";
import UserProfile from "./pages/UserProfile";
import { useEffect, useState } from "react";
import { initSocket, closeSocket } from "./socket";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "./config/apiconfig";
import { login } from "./store/authSlicer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./components/ui/Loader";

function App() {
    const { user } = useSelector((state:any) => state.auth);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    // const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user?.id) {
            const socket = initSocket(user.id);

            socket.on("newMessage", (message) => {
                console.log("💬 New message received:", message);
            });

            return () => {
                closeSocket();
            };
        }
    }, [user?.id]);

    const token = localStorage.getItem("token")
    useEffect(() => {
        if(user && token ) navigate("/")


        if (token ) {
            const getUserProfile = async () => {
                try {
                    setLoading(true)
                    const data = await axiosInstance.get("/user/me");
                    dispatch(login({ user: data.data }));
                    navigate("/")
                } catch (error: any) {
                    toast.error(error.message)
                    localStorage.removeItem("token")
                    navigate("/login")
                }finally{
                    setLoading(false)
                }

            };
            getUserProfile()
        }
    }, [token]);

    if(loading){
        return <Loader/>
    }
    return (

        <div>

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/" element={<Layout />}>

                    {/* authenticated routes */}
                    <Route element={<Authenticated />}>
                        <Route index path="/" element={<HomePage />} />
                        <Route path="/logout" element={<LogoutButton />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/online" element={<OnlineUser />} />
                        <Route path="/network" element={<NetworkGraph />} />
                        <Route path="/user/:userId" element={<UserProfile />} />
                    </Route>
                </Route>
            </Routes>
            <ToastContainer />
        </div>

    );
}

export default App;

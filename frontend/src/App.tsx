import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useAppSelector } from "./hooks/hooks";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Authenticated from "./components/Authenticated";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/Logout";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import OnlineUser from "./components/OnlineUser";
import { useEffect } from "react";
import { initSocket, closeSocket } from "./socket";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "./config/apiconfig";
import { login } from "./store/authSlicer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function App() {
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate()
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
        if(token && !user){
             navigate("/")
        }
        if (token && !user) {
            const getUserProfile = async () => {
                try {
                    const data = await axiosInstance.get("/user/me");
                    console.log(data.data);
                    dispatch(login({ user: data.data }));
                } catch (error: any) {
                    console.error(" failed:", error?.message);
                    toast.error(error.message)
                } finally {
                }
            };
            getUserProfile()
        }
    }, [token]);
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
                        </Route>
                    </Route>
                </Routes>
                <ToastContainer />
            </div>
    
    );
}

export default App;

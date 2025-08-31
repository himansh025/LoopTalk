import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import axiosInstance from "../config/apiconfig";
import { logout } from "../store/authSlicer";
import { GlobeIcon, LogOut, MessageCircle, UserRoundCogIcon } from "lucide-react";
import { MdLogin } from "react-icons/md";

interface LogoutResponse {
  message: string;
}
interface SidebarProps {
  closeSidebar?: () => void; // optional for mobile
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      await axiosInstance.post<LogoutResponse>(`/user/logout`);
      navigate("/login");
      dispatch(logout());
      if (closeSidebar) closeSidebar();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-blue-950 text-white p-4 flex flex-col h-full w-full">
      <span className="text-lg font-bold mb-4">Chit-Chat</span>

      <div className="flex flex-col text-lg gap-3">
        <Link to="/" onClick={closeSidebar} className="flex gap-3 items-center">
          <MessageCircle /> Chats
        </Link>
        <Link to="/profile" onClick={closeSidebar} className="flex gap-3 items-center">
          <UserRoundCogIcon /> Profile
        </Link>
           <Link to="/online" onClick={closeSidebar} className="flex gap-3 items-center">
          <GlobeIcon /> Online
        </Link>
        
      </div>

      {user ? (
        <div className="mt-auto">
          <button
            onClick={logoutHandler}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
          >
            <LogOut className="inline mr-2" /> Logout
          </button>
        </div>
      ):
      <>
       <Link to="/login" onClick={closeSidebar} className="flex gap-3 text-lg h-8 mt-2 items-center">
          <MdLogin /> Login
        </Link>
      </>}
    </div>
  );
};

export default Sidebar;

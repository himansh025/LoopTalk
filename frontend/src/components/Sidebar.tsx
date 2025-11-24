import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import axiosInstance from "../config/apiconfig";
import { logout } from "../store/authSlicer";
import { GlobeIcon, LogOut, MessageSquare, User, Code2 } from "lucide-react";
import { MdLogin } from "react-icons/md";
import { Button } from "./ui/Button";

interface LogoutResponse {
  message: string;
}
interface SidebarProps {
  closeSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const logoutHandler = async () => {
    try {
      await axiosInstance.post<LogoutResponse>(`/user/logout`);
      localStorage.removeItem("token");
      dispatch(logout());
      navigate("/login");
      if (closeSidebar) closeSidebar();
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    { path: "/", icon: MessageSquare, label: "Chats" },
    { path: "/online", icon: GlobeIcon, label: "Online Users" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex h-full w-full flex-col border-r border-white/20 bg-slate-900/95 text-slate-300 backdrop-blur-xl">
      {/* Brand */}
      <div className=" hidden md:flex items-center gap-3 p-6 text-white">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
          <Code2 size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight">LoopTalk</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                : "hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Section */}
      <div className="border-t border-white/10 p-4">
        {user ? (
          <div className="mb-4 flex items-center gap-3 px-2">
            <img
              src={
                user.profilePhoto ||
                `https://ui-avatars.com/api/?name=${user.fullName}`
              }
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-indigo-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user.fullName.toUpperCase()}
              </p>
              <p className="truncate text-xs text-slate-500">@{user.username}</p>
            </div>
          </div>
        ) : null}

        {user ? (
          <Button
            variant="danger"
            className="w-full justify-start gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
            onClick={logoutHandler}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        ) : (
          <NavLink to="/login" onClick={closeSidebar}>
            <Button className="w-full gap-2">
              <MdLogin size={18} />
              <span>Sign In</span>
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

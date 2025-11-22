import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import axiosInstance from "../config/apiconfig";
import { logout } from "../store/authSlicer";
import { GlobeIcon, LogOut, MessageSquare, User,  Code2 } from "lucide-react";
import { MdLogin } from "react-icons/md";

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
      navigate("/login");
      dispatch(logout());
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
    <div className="bg-slate-900 text-slate-300 flex flex-col h-full w-full border-r border-slate-800">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Code2 size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight">DevChat</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Section */}
      <div className="p-4 border-t border-slate-800">
        {user ? (
          <div className="flex items-center gap-3 mb-4 px-2">
            <img
              src={user.profilePhoto || `https://ui-avatars.com/api/?name=${user.fullName}`}
              alt="Profile"
              className="w-9 h-9 rounded-full border border-slate-600"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 truncate">@{user.username}</p>
            </div>
          </div>
        ) : null}

        {user ? (
          <button
            onClick={logoutHandler}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600/90 hover:text-white text-slate-400 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            onClick={closeSidebar}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <MdLogin size={18} />
            <span>Sign In</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

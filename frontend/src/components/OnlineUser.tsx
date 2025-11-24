import React, { useEffect, useState, useMemo } from "react";
import { initSocket, getSocket } from "../socket";
import axiosInstance from "../config/apiconfig";
import SearchBar from "./OnSearch";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { MessageSquare, Users } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface User {
  _id: string;
  fullName: string;
  username: string;
  profilePhoto?: string;
}

const OnlineUser: React.FC = () => {
  const onlineUserIds = useSelector((state: any) => state.onlineUsers.users);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"online" | "all">("online");
  const { user } = useSelector((state: any) => state.auth);
  const [openUserChat, setOpenUserChat] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/user/all");
        const me = user?.id;
        const filteredUsers = data.filter((u: any) => u._id !== me);
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [user?.id]);

  const handleSearch = async (query: string) => {
    try {
      if (query) {
        const res = await axiosInstance.get(`/user/all?search=${query}`);
        setAllUsers(res.data);
      }
    } catch (err) {
      console.error("User search failed", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getSocket() || initSocket(user.id);
    }
  }, [user]);

  const onlineUsers = useMemo(() => {
    return allUsers.filter((u) => {
      return onlineUserIds.includes(u._id) && u._id !== user?.id;
    });
  }, [allUsers, onlineUserIds, user?.id]);

  const handleUserClick = (userData: any) => {
    setOpenUserChat(true);
    setUserData(userData);
  };

  if (openUserChat) {
    return (
      <div className="h-full w-full">
        <div className="flex items-center gap-4 border-b border-slate-200 bg-white/80 p-4 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenUserChat(false)}
          >
            Back
          </Button>
          <h2 className="font-semibold text-slate-900">
            Chat with {(userData as any).fullName}
          </h2>
        </div>
        <div className="h-[calc(100%-4rem)]">
          <Messages userChat={userData} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const displayUsers = activeTab === "online" ? onlineUsers : allUsers;
  const isUserOnline = (userId: string) => onlineUserIds.includes(userId);

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">People</h1>
          <p className="text-slate-500">Connect with developers</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab("online")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "online"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Online ({onlineUsers.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "all"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            All Users ({allUsers.length})
          </button>
        </div>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {displayUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 py-20 text-center backdrop-blur-sm">
          <div className="mb-4 text-slate-300">
            <Users size={48} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No users found</h3>
          <p className="text-slate-500">
            Try adjusting your search or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayUsers.map((user) => {
            const userIsOnline = isUserOnline(user._id);

            return (
              <Card
                key={user._id}
                className="group relative flex cursor-pointer flex-col items-center overflow-hidden p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleUserClick(user)}
                />

                <div className="relative z-10 mb-4" onClick={() => handleUserClick(user)}>
                  <div className="relative">
                    <img
                      src={
                        user.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.fullName
                        )}&background=6366f1&color=fff`
                      }
                      alt={user.fullName}
                      className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md transition-transform group-hover:scale-105"
                    />
                    {userIsOnline && (
                      <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-sm"></span>
                    )}
                  </div>
                </div>

                <div className="z-10 mb-6 w-full min-w-0" onClick={() => handleUserClick(user)}>
                  <h3 className="truncate text-lg font-semibold text-slate-900">
                    {user.fullName}
                  </h3>
                  <p className="truncate text-sm text-slate-500">
                    @{user.username}
                  </p>
                </div>

                <Button
                  className="z-10 mt-auto w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(user);
                  }}
                >
                  <MessageSquare size={16} />
                  Message
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnlineUser;
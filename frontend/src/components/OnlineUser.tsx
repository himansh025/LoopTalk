import React, { useEffect, useState, useMemo } from "react";
import { initSocket, getSocket } from "../socket";
import axiosInstance from "../config/apiconfig";
import SearchBar from "./OnSearch";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { MessageSquare, Users, ArrowLeft } from "lucide-react";
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
      <div className="h-full w-full bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="flex items-center gap-4 border-b border-slate-200 bg-white/80 p-4 backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            // onClick={() => setOpenUserChat(false)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <img
              src={(userData as any).profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent((userData as any).fullName)}&background=6366f1&color=fff`}
              alt={(userData as any).fullName}
              className="h-8 w-8 rounded-full"
            />
            <h2 className="font-semibold text-slate-900">
              {(userData as any).fullName}
            </h2>
          </div>
        </div>
        <div className="h-[calc(100%-4rem)]">
          <Messages userChat={userData} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const displayUsers = activeTab === "online" ? onlineUsers : allUsers;
  const isUserOnline = (userId: string) => onlineUserIds.includes(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Connect</h1>
              <p className="mt-2 text-lg text-slate-600">Find and chat with developers</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => setActiveTab("online")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "online"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Online ({onlineUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab("all")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === "all"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Users ({allUsers.length})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Users List/Grid */}
        {displayUsers.length === 0 ? (
          <Card className="flex flex-col items-center justify-center rounded-2xl border-0 bg-white/80 py-20 text-center backdrop-blur-sm shadow-xl">
            <div className="mb-4 text-slate-300">
              <Users size={64} />
            </div>
            <h3 className="mb-2 text-xl font-medium text-slate-900">No users found</h3>
            <p className="text-slate-500 max-w-sm">
              {activeTab === "online" 
                ? "No users are currently online. Try checking all users."
                : "Try adjusting your search or check back later."}
            </p>
          </Card>
        ) : (
          <>
            {/* Mobile List View */}
            <div className="block lg:hidden">
              <div className="space-y-3">
                {displayUsers.map((user) => {
                  const userIsOnline = isUserOnline(user._id);
                  
                  return (
                    <Card
                      key={user._id}
                      className="flex cursor-pointer items-center gap-4 p-4 transition-all hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm"
                      // onClick={() => handleUserClick(user)}
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            user.profilePhoto ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.fullName
                            )}&background=6366f1&color=fff`
                          }
                          alt={user.fullName}
                          className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                        />
                        {userIsOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-semibold text-slate-900">
                            {user.fullName}
                          </h3>
                          {userIsOnline && (
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                          )}
                        </div>
                        <p className="truncate text-sm text-slate-500">
                          @{user.username}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        className="flex-shrink-0 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(user);
                        }}
                      >
                        <MessageSquare size={14} />
                        <span className="hidden sm:inline">Chat</span>
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden lg:grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {displayUsers.map((user) => {
                const userIsOnline = isUserOnline(user._id);

                return (
                  <Card
                    key={user._id}
                    className="group relative flex cursor-pointer flex-col items-center overflow-hidden p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl border-0 bg-white/80 backdrop-blur-sm"
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
                      <div className="mt-2 flex items-center justify-center gap-2">
                        {userIsOnline ? (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                            Offline
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      className="z-10 mt-auto w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
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
          </>
        )}
      </div>
    </div>
  );
};

export default OnlineUser;
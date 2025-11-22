// OnlineUser.tsx - Responsive width for large screens
import React, { useEffect, useState } from "react";
import { initSocket, getSocket } from "../socket";
import axiosInstance from "../config/apiconfig";
import SearchBar from "./OnSearch";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { MessageSquare } from "lucide-react";

interface user2 {
  id: string;
  name: string;
  avatar: string;
  email: string;
  username: string;
  online: boolean;
  gender: string
}

const OnlineUser: React.FC = () => {
  const onlineUserIds = useSelector((state: any) => state.onlineUsers.users);
  const [allUsers, setAllUsers] = useState<user2[]>([]); // Typed correctly
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'online' | 'all'>('online');
  const { user } = useSelector((state: any) => state.auth)
  const [openUserChat, setOpenUserChat] = useState(false);
  const [userData, setUserData] = useState({});


  useEffect(() => {

    const fetchAllUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/user/all");
        const me = user?.id
        const filteredUsers = data.filter((user: any) => user._id != me);
        setAllUsers(filteredUsers);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    };

    const getFriends = async () => {
      try {
        const { data } = await axiosInstance.get("/friend/friends");
        console.log(data)
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
      }
    };

    fetchAllUsers();
    getFriends();
  }, []);


  const handleSearch = async (query: string) => {
    try {
      if (query) {
        const res = await axiosInstance.get(`/user/all?search=${query}`);
        setAllUsers(res.data);

      }
    } catch (err) {
      console.error("User search failed", err);
    }
  }

  useEffect(() => {
    const socket = getSocket() || initSocket(user.id);
    console.log("socket", socket);
  }, [user]);

  const onlineUsers = React.useMemo(() => {
    return allUsers.filter((u: any) => {
      const uid = u._id || u.id;
      return onlineUserIds.includes(uid) && uid !== user?.id;
    });
  }, [allUsers, onlineUserIds, user?.id]);

  const handleUserClick = (userData: any) => {
    console.log("Start chat with:", userData);
    setOpenUserChat(true)
    setUserData(userData)
  };

  if (openUserChat) {
    return (
      <Messages
        userChat={userData}
      />
    )
  }

  if (loading) {
    return (
      <div className="p-6 w-full">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayUsers = activeTab === 'online' ? onlineUsers : allUsers;
  const isUserOnline = (userId: any) => {
    return onlineUsers.some(user => user == userId);
  };
  console.log("isOnlineUser", isUserOnline)


  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">People</h1>
          <p className="text-slate-500">Connect with developers</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('online')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'online'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Online ({onlineUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            All Users ({allUsers.length})
          </button>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Users Grid */}
      {displayUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="text-slate-300 mb-4">
            <MessageSquare size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No users found</h3>
          <p className="text-slate-500">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayUsers.map((user: any) => {
            const userId = user._id || user.id;
            const userIsOnline = isUserOnline(userId);

            return (
              <div
                key={userId}
                onClick={() => handleUserClick(user)}
                className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative mb-4">
                  <img
                    src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=fff`}
                    alt={user.fullName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 group-hover:scale-105 transition-transform"
                  />
                  {userIsOnline && (
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                  )}
                </div>

                <div className="w-full min-w-0 mb-4">
                  <h3 className="font-semibold text-slate-900 truncate text-lg">{user.fullName}</h3>
                  <p className="text-sm text-slate-500 truncate">@{user.username}</p>
                </div>

                <button
                  className="w-full mt-auto py-2.5 px-4 bg-slate-50 text-slate-700 font-medium rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Message</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnlineUser;
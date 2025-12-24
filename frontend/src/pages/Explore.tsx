import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initSocket, getSocket } from "../socket";
import axiosInstance from "../config/apiconfig";
import SearchBar from "../components/OnSearch";
import Messages from "../components/Messages";
import { useSelector } from "react-redux";
import { MessageSquare, UserPlus, Clock, Check, X, UserMinus } from "lucide-react";
import { toast } from "react-toastify";
import { Loader } from "../components/Loader";

interface user2 {
  id: string;
  name: string;
  avatar: string;
  email: string;
  username: string;
  online: boolean;
  gender: string;
  requestId?: string;
}

const Explore: React.FC = () => {
  const onlineUserIds = useSelector((state: any) => state.onlineUsers.users);
  const [allUsers, setAllUsers] = useState<user2[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'online' | 'all' | 'friends' | 'requestList'>('online');
  const { user } = useSelector((state: any) => state.auth)
  const [openUserChat, setOpenUserChat] = useState(false);
  const [userData, setUserData] = useState({});
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [requestList, setRequestList] = useState<any[]>([]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/friend/pending");
      setRequestList(data.requests);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/user/all");
        const me = user?._id || user?.id
        const filteredUsers = data.allUsers?.filter((user: any) => user._id != me);
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    const getFriends = async () => {
      try {
        const { data } = await axiosInstance.get("/friend/friends");
        setFriends(data.friends)
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
        setLoading(false);
      }
    };

    fetchAllUsers();
    getFriends();
    fetchRequests();
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
    const socket = getSocket() || initSocket(user?._id || user?.id);
    socket.on("onlineUser", (data: any) => {
      console.log("onlineUser", data);
    })
  }, [user]);

  const onlineUsers = React.useMemo(() => {
    return allUsers?.filter((u: any) => {
      const uid = u._id || u.id;
      return onlineUserIds.includes(uid) && uid !== (user?._id || user?.id);
    });
  }, [allUsers, onlineUserIds, user?._id, user?.id]);

  const navigate = useNavigate();

  const handleViewProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleStartChat = (e: React.MouseEvent, userData: any) => {
    e.stopPropagation();
    setOpenUserChat(true);
    setUserData(userData);
  };

  const handleSendRequest = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await axiosInstance.post("/friend/send", { recipientId: userId });
      toast.success("Friend request sent!");
      setPendingRequests([...pendingRequests, userId]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await axiosInstance.put(`/friend/accept/${requestId}`);
      toast.success("Friend request accepted");
      fetchRequests();
      const { data } = await axiosInstance.get("/friend/friends");
      setFriends(data.friends);
    } catch (error: any) {
      console.error("Failed to accept", error);
      toast.error("Failed to accept request");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    try {
      await axiosInstance.put(`/friend/reject/${requestId}`);
      toast.success("Friend request rejected");
      fetchRequests();
    } catch (error: any) {
      console.error("Failed to reject", error);
      toast.error("Failed to reject request");
    }
  };

  const handleRemoveFriend = async (e: React.MouseEvent, friendId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      await axiosInstance.delete(`/friend/remove/${friendId}`);
      toast.success("Friend removed");
      const { data } = await axiosInstance.get("/friend/friends");
      setFriends(data.friends);
    } catch (error: any) {
      console.error("Failed to remove friend", error);
      toast.error("Failed to remove friend");
    }
  };

  const isFriend = (userId: string) => {
    return friends.some((f: any) => f._id === userId || f.id === userId);
  };


  if (openUserChat) {
    return (
      <Messages
        userChat={userData}
      />
    )
  }


  const displayUsers = React.useMemo(() => {
    if (activeTab === 'online') return onlineUsers;
    if (activeTab === 'friends') return friends;
    if (activeTab === 'requestList') {
      return requestList.map((req: any) => ({
        ...req.requester,
        requestId: req._id
      }));
    }

    return allUsers;
  }, [activeTab, onlineUsers, friends, allUsers, requestList]);

  const isUserOnline = (userId: any) => {
    return onlineUsers.some(user => user == userId);
  };

  if (loading) {
    return <Loader />
  }
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
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'all'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            All Users ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('requestList')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'requestList'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Requests ({requestList?.length})
          </button>
          <button
            onClick={() => setActiveTab('online')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'online'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Online  ({onlineUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'friends'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            Friends ({friends.length})
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
            const isUserFriend = isFriend(userId);
            const isPending = pendingRequests.includes(userId);

            return (
              <div
                key={userId}
                onClick={() => handleViewProfile(userId)}
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

                {activeTab === 'requestList' ? (
                  <div className="w-full mt-auto flex gap-2">
                    <button
                      onClick={(e) => handleAccept(e, user.requestId)}
                      className="flex-1 py-2.5 bg-green-50 text-green-600 font-medium rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <Check size={16} />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={(e) => handleReject(e, user.requestId)}
                      className="flex-1 py-2.5 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                ) : isUserFriend ? (
                  <div className="w-full mt-auto flex gap-2">
                    <button
                      onClick={(e) => handleStartChat(e, user)}
                      className="flex-1 py-2.5 bg-slate-50 text-slate-700 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={(e) => handleRemoveFriend(e, userId)}
                      className="py-2.5 px-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                      title="Remove Friend"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => isPending ? null : handleSendRequest(e, userId)}
                    disabled={isPending}
                    className={`w-full mt-auto py-2.5 px-4 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isPending
                      ? "bg-yellow-50 text-yellow-600 cursor-not-allowed"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                      }`}
                  >
                    {isPending ? <Clock size={16} /> : <UserPlus size={16} />}
                    <span>{isPending ? "Sent" : "Add Friend"}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Explore;
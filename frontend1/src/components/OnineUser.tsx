// OnlineUser.tsx - Responsive width for large screens
import React, { useEffect, useState } from "react";
import { socket } from "../App";
import { useAppSelector } from "../hooks/hooks";
import axiosInstance from "../config/apiconfig";
import type  {user}  from '../types/type.data';
import SearchBar from "./OnSearch";
import Messages from "./Messages";
import { isRejected } from "@reduxjs/toolkit";

const OnlineUser: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<user[]>([]);
  const [allUsers, setAllUsers] = useState<[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'online' | 'all'>('online');
const {user}= useAppSelector((state)=>state.auth)
const [openUserChat,setOpenUserChat]= useState(false);
const [userData,setUserData]= useState({});


  useEffect(() => {  const fetchAllUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/user/all");
      // Filter out current user from all users
      console.log(data)
      console.log(user?.id)
      const me=user?.id
      const filteredUsers = data.filter((user: any) => user._id != me );
      console.log(filteredUsers)
      setAllUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setLoading(false);
    }
  };
    fetchAllUsers();
  }, []);

  const handleSearch=async(query:string)=>{
     try {
      if(query){
        const res = await axiosInstance.get(`/user/all?search=${query}`);
        setAllUsers(res.data);

      }
    } catch (err) {
      console.error("User search failed", err);
    }
  }

  useEffect(() => {
    if (!socket || allUsers.length === 0) return;

    socket.on("getOnlineUsers", (onlineUserIds: string[]) => {
      console.log("Online user IDs received:", onlineUserIds);
      
      // Filter out current user
      const filteredOnlineIds = onlineUserIds.filter(id => id !== user?.id);
      
      // Find online users from allUsers array
      console.log(filteredOnlineIds);
      
      console.log("fd",allUsers)
      const updatedOnlineUsers = allUsers.filter((user) =>{
console.log(user);
         return filteredOnlineIds.includes(user?._id)
      } 
      );
      console.log(updatedOnlineUsers)
      setOnlineUsers(updatedOnlineUsers);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [allUsers, user]);

  const handleUserClick = (userData: any) => {
    console.log("Start chat with:", userData);
    setOpenUserChat(true)
    setUserData(userData)
  };

if(openUserChat){
  return(
   <Messages
    userChat={userData}
  />
  )
}

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-2xl shadow-md w-full max-w-sm lg:max-w-none lg:w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayUsers = activeTab === 'online' ? onlineUsers : allUsers;
  const isUserOnline = (userId: string) => {
    return onlineUsers.some(user => (user?.id || user.id) === userId);
  };


  return (
    <div className="p-4 bg-white rounded-2xl shadow-md w-full max-w-sm lg:max-w-none lg:w-full">
      {/* Tab Headers */}
     <div className="my-2">
       <SearchBar onSearch={handleSearch}/>
     </div>
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1 max-w-md mx-auto lg:mx-0">
        <button
          onClick={() => setActiveTab('online')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'online'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Online ({onlineUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Users ({allUsers.length})
        </button>
      </div>

      {/* Users Grid/List */}
      {displayUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-500 text-lg">
            {activeTab === 'online' ? 'No users online' : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {displayUsers.map((user: any) => {
            const userId = user._id || user.id;
            const userIsOnline = isUserOnline(userId);
            
            return (
              <div
                key={userId}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-md"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={user.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0D8ABC&color=fff`}
                      alt={user.fullName}
                      className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0D8ABC&color=fff`;
                      }}
                    />
                    {/* Online indicator */}
                    {userIsOnline && (
                      <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  
                  <div className="w-full">
                    <p className="font-medium text-gray-900 mb-1 truncate">{user.fullName}</p>
                    <p className={`text-sm mb-2 ${userIsOnline ? 'text-green-600' : 'text-gray-500'}`}>
                      {userIsOnline ? 'Online' : 'Offline'}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-400 truncate mb-3">{user.email}</p>
                    )}
                    
                    {/* Chat button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserClick(user);
                      }}
                      className="w-full px-3 py-2 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium"
                    >
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnlineUser;
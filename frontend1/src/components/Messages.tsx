// Messages.tsx
import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { useAppSelector } from "../hooks/hooks";
import { socket } from "../App";

interface MessagesProps {
  userChat?: any; 
}

const Messages: React.FC<MessagesProps> = ({ 
  userChat 
}) => {

  const listRef = useRef<HTMLDivElement | null>(null);
  const {user}= useAppSelector((state)=>state.auth)
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
// console.log(userChat)
  const getMessages = async (otherUserId: string) => {
    try {
      const res = await axiosInstance.get(`/message/${otherUserId}`);
      console.log("msges",res.data)
      setCurrentMessages(res.data);
    } catch (error: any) {
      toast.error("Failed to fetch messages");
    }
  };


useEffect(()=>{
  if(socket){
    console.log("yes",socket)
    socket.on("newMessage", (message: any) => {
      // Update current messages if viewing the chat
      setCurrentMessages(prev => [...prev, message]);
      getMessages(userChat._id)
      
    });
  }
        getMessages(userChat._id)

},[])

  
  // Send message
  const sendMessage = async (message: string) => {
    try {
    if (message.trim()) {
      const otherUserId = userChat?._id;
      if (!otherUserId) return;
        const { data } = await axiosInstance.post(`/message/send/${otherUserId}`, {
          message
        });        
        setCurrentMessages(prev => [...prev, data.newMessage]);
        
  
      }
    }
    catch (error: any) {
      toast.error("Failed to send message");
    }
  };

 

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [currentMessages.length]);

  const formatTime = (timestamp: any) =>
    new Date(timestamp).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      {userChat && (
        <div className="bg-white border-b p-4 flex items-center">
          <img
            src={userChat?.profilePhoto!="" ? userChat?.profilePhoto : "https://images.com" }
            className="h-10 w-10 rounded-full bg-gray-400"
            alt={userChat?.otherUser?.fullName }
          />
          <div className="ml-3">
            <p className="font-semibold">{userChat?.fullName}</p>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 p-3 space-y-3 overflow-auto bg-gray-50"
        style={{ minHeight: 0 }}
      >
        {currentMessages.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-6">
            No messages yet — say hello 👋
          </div>
        )}

        {currentMessages.length > 0 && currentMessages?.map((msg:any, idx) => {
          const mine = msg.senderId === user?.id;
          return (
            <div
              key={msg.id || idx}
              className={`flex items-end gap-3 ${mine ? "justify-end" : "justify-start"}`}
            >
              {!mine && <div className="w-8 h-8 rounded-full bg-gray-300 shrink-0" />}
              <div className="max-w-[80%]">
                <div
                  className={`px-4 py-2 rounded-2xl break-words leading-relaxed shadow-sm ${
                    mine
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
                <div
                  className={`mt-1 text-[11px] ${
                    mine ? "text-right text-slate-100/80" : "text-left text-gray-400"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </div>
              </div>
              {mine && <div className="w-8 h-8 rounded-full bg-slate-300 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <MessageInput onSend={sendMessage} placeholder="Type a message..." />
    </div>
  );
};

export default Messages;
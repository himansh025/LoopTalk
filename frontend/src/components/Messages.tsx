import React, { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import { useAppSelector } from "../hooks/hooks";
import { getSocket, initSocket } from "../socket";
import { MoreVertical, Phone, Video } from "lucide-react";

interface MessagesProps {
  userChat?: any;
}

const Messages: React.FC<MessagesProps> = ({ userChat }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);

  // Fetch old messages
  const getMessages = async (otherUserId: string) => {
    try {
      const res = await axiosInstance.get(`/message/${otherUserId}`);
      setCurrentMessages(res.data);
    } catch (error: any) {
      toast.error("Failed to fetch messages");
    }
  };

  useEffect(() => {
    if (!userChat?._id || !user?._id) return;

    // Initialize socket once
    const socket = getSocket() || initSocket(user._id);

    // Register message listener
    socket.on("newMessage", (message: any) => {
      // Only append if it’s from or to current chat user
      if (
        message.senderId === userChat._id ||
        message.receiverId === userChat._id
      ) {
        setCurrentMessages((prev) => [...prev, message]);
      }
    });

    getMessages(userChat._id);

    // Cleanup listener when leaving chat
    return () => {
      socket.off("newMessage");
    };
  }, [userChat?._id, user?._id]);

  // Send message
  const sendMessage = async (message: string) => {
    try {
      if (message.trim()) {
        const otherUserId = userChat?._id;
        if (!otherUserId) return;
        const { data } = await axiosInstance.post(`/message/send/${otherUserId}`, { message });
        setCurrentMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error: any) {
      toast.error("Failed to send message");
    }
  };

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [currentMessages.length]);

  const formatTime = (timestamp: any) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {userChat && (
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userChat?.profilePhoto || `https://ui-avatars.com/api/?name=${userChat?.fullName}`}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
                alt={userChat?.fullName}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{userChat?.fullName}</h3>
              <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:text-slate-600 transition-colors"><Phone size={20} /></button>
            <button className="hover:text-slate-600 transition-colors"><Video size={20} /></button>
            <button className="hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>
      )}

      <div ref={listRef} className="flex-1 p-6 space-y-6 overflow-y-auto scroll-smooth" style={{ minHeight: 0 }}>
        {currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation with {userChat?.fullName}</p>
          </div>
        ) : (
          currentMessages.map((msg: any, idx) => {
            const mine = msg.senderId === user?._id;
            const isLast = idx === currentMessages.length - 1;

            return (
              <div key={msg._id || idx} className={`flex gap-3 ${mine ? "justify-end" : "justify-start"}`}>
                {!mine && (
                  <img
                    src={userChat?.profilePhoto || `https://ui-avatars.com/api/?name=${userChat?.fullName}`}
                    className="w-8 h-8 rounded-full self-end mb-1 border border-slate-200"
                    alt=""
                  />
                )}

                <div className={`flex flex-col max-w-[70%] ${mine ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3 text-sm leading-relaxed shadow-sm ${mine
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm"
                      }`}
                  >
                    {msg.message}
                  </div>
                  <span className={`text-[10px] mt-1 px-1 ${mine ? "text-slate-400" : "text-slate-400"}`}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <MessageInput onSend={sendMessage} placeholder={`Message ${userChat?.fullName || '...'}`} />
      </div>
    </div>
  );
};

export default Messages;

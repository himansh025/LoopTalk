import React from "react";
import type { chat } from "../types/type.data";
import {  Mail } from "lucide-react"; // placeholder if no profile pic

interface ChatListProps {
  chats: chat[];
  onChatClick: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatClick }) => {
  console.log(chats)
  return (
    <div className="bg-white rounded-lg shadow-md w-full ml-3 md:mx-10 md:max-w-full  max-w-sm">
      {chats.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">No chats yet</p>
      ) : (
        <>
           <p className="p-4 text-gray-500 ">All Chats : {chats?.length} </p>
        <ul className="divide-y divide-gray-200">
          {chats.map((c:any) => (
            <li
              key={c.id}
              onClick={() => onChatClick(c.id)}
              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
            >
              {/* Profile */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {c.lastMessage?.senderProfile ? (
                  <img
                    src={c.lastMessage?.senderProfile || ""}
                    alt="profile"
                    className="w-full h-full object-cover"
                    />
                  ) : (
                    <Mail className="text-gray-500" />
                  )}
              </div>

              {/* Name & Last Message */}
              <div className="flex-1 ml-4 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {c.lastMessage?.senderName || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {c.lastMessage?.text || "No messages yet"}
                </p>
              </div>

              {/* Unread Badge */}
              {c.unreadCount > 0 && (
                <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                  {c.unreadCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      </>
      )}
    </div>
  );
};

export default ChatList;

import React from "react";
import type { chat } from "../types/type.data";
import { User } from "lucide-react";
import { Card } from "./ui/Card";

interface ChatListProps {
  chats: chat[];
  onChatClick: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatClick }) => {
  return (
    <div className="h-full w-full p-4 md:p-6">
      <Card className="h-full w-full glass flex flex-col">
        <div className="border-b border-slate-100 p-4">
          <h2 className="text-xl font-bold text-slate-900">Messages</h2>
          <p className="text-sm text-slate-500">
            {chats.length} {chats.length === 1 ? "conversation" : "conversations"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {chats.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <User size={32} />
              </div>
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((c: any) => (
                <button
                  key={c.id}
                  onClick={() => onChatClick(c.id)}
                  className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all duration-200 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                    {c.otherUser?.profilePhoto ? (
                      <img
                        src={c.otherUser.profilePhoto}
                        alt="profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="truncate font-semibold text-slate-900">
                        {c.otherUser?.fullName || "Unknown User"}
                      </h3>
                      {c.lastMessage?.timestamp && (
                        <span className="text-xs text-slate-400">
                          {new Date(c.lastMessage.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {c.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>

                  {c.unreadCount > 0 && (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {c.unreadCount}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ChatList;

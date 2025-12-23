import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import Messages from "./Messages";
import { ArrowLeftCircle, Loader } from "lucide-react";
import { initSocket, getSocket } from "../socket"; // Import socket
import { setChats } from "../store/chatSlicer";
import { useSelector } from "react-redux";
import { Button } from "./ui/Button";

interface Props {
  currentUserId: string;
}

export default function MessageContainer({ currentUserId }: Props) {
  const { user } = useSelector((state: any) => state.auth);
  const [allChat, setAllChat] = useState<any[]>([]);
  const [userChatId, setUserChatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<any[]>([]);
  const getAllChat = async () => {
    try {
      const { data } = await axiosInstance.get("/message/allChats");
      const formattedChat = data.map((chat: any) => {
        const otherUser = chat.participants.find(
          (p: any) => p._id !== currentUserId
        );

        return {
          id: chat._id,
          participants: chat.participants,
          messages: chat.messages || [],
          otherUser: otherUser,
          lastMessage: chat.messages?.[0]
            ? {
              senderId: chat.messages[0].senderId,
              senderName: otherUser?.fullName || "Unknown",
              senderProfile: otherUser?.profilePhoto || "",
              text: chat.messages[0].message,
              timestamp: chat.messages[0].createdAt,
            }
            : null,
          unreadCount: 0,
        };
      });

      setAllChat(formattedChat);
      setChats(formattedChat);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Fetching chats failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    let socket: any;
    if (user) {
      socket = getSocket() || initSocket(user._id || user.id)

    }
    if (socket) {
      getAllChat();
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, []);

  const handleChatClick = (id: string) => {
    setUserChatId(id);
    const selectedChat = allChat.find(chat => chat.id === id);
    if (selectedChat?.otherUser) {
      setSelectedChat(selectedChat?.otherUser);
    }
  };

  const handleBack = () => {
    setUserChatId("");
  };

  if (loading) {
    return <Loader />
  }

  return (
    <div className="flex h-full flex-1 overflow-hidden bg-slate-50/50">
      {userChatId === "" ? (
        <ChatList chats={allChat} onChatClick={handleChatClick} />
      ) : (
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center gap-4 border-b border-slate-200 bg-white/80 p-4 backdrop-blur-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeftCircle />Back
            </Button>
          </div>

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <Messages userChat={selectedChat} />
          </div>
        </div>
      )}
    </div>
  );
}
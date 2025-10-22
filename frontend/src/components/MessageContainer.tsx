import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import axiosInstance from "../config/apiconfig";
import { toast } from "react-toastify";
import Messages from "./Messages";
import { ArrowLeftCircle } from "lucide-react";
import { initSocket,getSocket } from "../socket"; // Import socket
import { setChats } from "../store/chatSlicer";
import { useSelector } from "react-redux";

interface Props {
  currentUserId: string;
}

export default function MessageContainer({ currentUserId }: Props) {
    const { user } = useSelector((state:any) => state.auth);
  const [allChat, setAllChat] = useState<any[]>([]);
  const [userChatId, setUserChatId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChat,setSelectedChat]= useState<any[]>([])
 
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
              }
            : null,
          unreadCount: 0,
        };
      });

      setAllChat(formattedChat);
      setChats(formattedChat)
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Fetching chats failed");
      setLoading(false);
    }
  };

  useEffect(() => {
     let socket:any
    if(user){
       socket=getSocket()||initSocket(user.id)
      // console.log(user);

    }
    if (socket) {
        getAllChat(); }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, []);

  const handleChatClick = (id: string) => {
    setUserChatId(id);
    const selectedChat = allChat.find(chat => chat.id === id);
    // console.log(selectedChat,"vdfv")
    if (selectedChat?.otherUser) {
      setSelectedChat(selectedChat?.otherUser)
    }
  };

  const handleBack = () => {
    setUserChatId("");
  };


  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      {userChatId === "" ? (
        <ChatList chats={allChat} onChatClick={handleChatClick} />
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex items-center p-4 bg-white border-b">
            <button
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
              onClick={handleBack}
            >
              <ArrowLeftCircle />Back
            </button>
            <span>Back to Chats</span>
          </div>
          
          <Messages
            userChat={selectedChat}
          />
        </div>
      )}
    </div>
  );
}
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
      console.log(req.id);
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        console.log(newMessage)
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        
      await gotConversation.save();
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req,res) => {
    try {
        const {id} = req.params;
        console.log(req.params)
        const senderId = req.id;
        console.log(id,senderId)
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, id]}
        }).populate("messages").sort({createdAt:1}); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}

export const getChats = async (req, res) => {
  try {
    const userId = req.id; // from isAuthenticated middleware

    const chats = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate({
        path: "participants",
        select: "fullName profilePhoto email", // Select only needed fields
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 },limit:1 }, // Only get last message
      });

      console.log("user chats",chats)

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chats" });
  }
};

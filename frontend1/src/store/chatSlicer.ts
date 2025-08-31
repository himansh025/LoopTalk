// store/slices/chatSlice.ts
import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { Chat, Message } from "../types/type.data";

interface ChatState {
  allChats: Chat[];
  loading: boolean;
}

const initialState: ChatState = {
  allChats: [],
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.allChats = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: Message }>
    ) => {
      const chat = state.allChats.find((c) => c.id === action.payload.chatId);
      if (chat) {
        chat.messages.unshift(action.payload.message);

        // update lastMessage for chat list UI
        const sender = chat.participants.find(
          (u) => u.id === action.payload.message.senderId
        );

        chat.lastMessage = {
          senderId: action.payload.message.senderId,
          senderName: sender?.name || "Unknown",
          senderProfile: sender?.avatar || "",
          text: action.payload.message.message,
        };
      }
    },
  },
});

export const { setChats, addMessage } = chatSlice.actions;
export default chatSlice.reducer;

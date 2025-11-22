import { createSlice } from "@reduxjs/toolkit";

interface OnlineUsersState {
  users: string[];
}

const initialState: OnlineUsersState = {
  users: [],
};

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;

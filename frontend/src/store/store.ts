import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlicer'
import chatReducer from './chatSlicer'
import onlineUsersReducer from './onlineUsersSlice'
import graphReducer from './graphSlice'
const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        onlineUsers: onlineUsersReducer,
        graph: graphReducer
    }
})


export default store;
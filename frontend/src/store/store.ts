import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlicer'
import chatReducer from  './chatSlicer'
import onlineUsersReducer from './onlineUsersSlice'
const store=configureStore({
    reducer:{
        auth:authReducer,
        chat:chatReducer,
        onlineUsers: onlineUsersReducer
    }
})
export type RootState= ReturnType<typeof store.getState>
export type AppDispatch= typeof store.dispatch

export default store;
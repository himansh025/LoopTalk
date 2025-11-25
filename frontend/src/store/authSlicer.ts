import { createSlice } from '@reduxjs/toolkit'


interface User {
    _id: string;
    id?: string;
    username: string;
    email: string;
    fullName: string;
    profilePhoto: string;
    gender?: string;
}

interface authState {
    status: Boolean;
    user: User | null;
}

const initialState: authState = {
    status: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true,
                state.user = action.payload.user
        },
        logout: (state) => {
            state.status = false,
                state.user = null
        }
    },
})
export const { login, logout } = authSlice.actions
export default authSlice.reducer
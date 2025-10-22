import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface User {
    id: string;
    email: String;
    name: String;
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
        login: (state, action: PayloadAction<{ user: User }>) => {
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
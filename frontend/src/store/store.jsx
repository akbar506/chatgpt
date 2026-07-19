import { configureStore } from '@reduxjs/toolkit'
import userReducer from "@/store/user/userSlice"
import authReducer from "@/store/auth/authSlice"
import chatReducer from "@/store/chat/chatSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    chat: chatReducer,
  },
})
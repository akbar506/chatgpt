import { configureStore } from '@reduxjs/toolkit'
import userReducer from "@/store/user/userSlice"
import authReducer from "@/store/auth/authSlice"
import chatReducer from "@/store/chat/chatSlice"
import { injectStore } from "@/config/interceptorConfig"

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    chat: chatReducer,
  },
})

injectStore(store);
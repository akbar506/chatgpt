import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversations: [],
    currentConversation: null,
    initialMessage: null,
    loading: false,
    error: null,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        deleteConversation: (state, action) => {
            state.conversations = state.conversations.filter(
                (conversation) => conversation._id !== action.payload
            )
        },
        addConversation: (state, action) => {
            state.conversations.unshift(action.payload)
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload
        },
        setChatCreating: (state, action) => {
            state.loading = action.payload
        },
        setChatError: (state, action) => {
            state.error = action.payload
        },
        setInitialMessage: (state, action) => {
            state.initialMessage = action.payload
        }
    }
});

export const { setConversations, deleteConversation, addConversation, setCurrentConversation, setChatCreating, setChatError, setInitialMessage } = chatSlice.actions

export default chatSlice.reducer
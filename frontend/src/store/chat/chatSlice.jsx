import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    conversations: [],
    currentConversation: null,
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
            state.conversations.push(action.payload)
        },
        setCurrentConversation: (state, action) => {
            state.currentConversation = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    }
});

export const { setConversations, deleteConversation, addConversation, setCurrentConversation, setLoading, setError } = chatSlice.actions

export default chatSlice.reducer
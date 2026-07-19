import axios from "@/config/axiosConfig";
import { setChatError, setConversations, addConversation, setChatCreating } from "./chatSlice";

export const fetchChats = () => async (dispatch, getState) => {
    try {
        dispatch(setChatError(null)); // Clear any previous error
        const response = await axios.get(`/chat`);
        const { chats } = response.data;
        dispatch(setConversations(chats));
    } catch (error) {
        dispatch(setChatError(error.response?.data?.message || "Failed to load chats"));
        return;
    }
}

export const createChat = (chatData) => async (dispatch) => {
    try {
        dispatch(setChatError(null));
        dispatch(setChatCreating(true));
        const response = await axios.post(`/chat`, chatData);
        const { chat } = response.data;
        dispatch(addConversation(chat));
        return chat;
    } catch (error) {
        dispatch(setChatError(error.response?.data?.message || "Failed to create chat"));
        return null;
    } finally {
        dispatch(setChatCreating(false));
    }
};
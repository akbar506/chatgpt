import axios from "axios";

export const getSharedChat = async (shareToken) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/chat/share/${shareToken}`);
        return { success: true, chat: response.data.chat, messages: response.data.messages };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to get shared chat" };
    }
}
import axios from "@/config/axiosConfig";

export const shareChat = async (chatId) => {
    try {
        const response = await axios.post(`/chat/share/${chatId}`);
        return { success: true, link: response.data.link };
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to share chat" };
    }
}
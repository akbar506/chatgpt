import axios from "@/config/axiosConfig"

export const getMessages = async (conversationId) => {
    try {
        const response = await axios.get(`/message/${conversationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return { error: error.response?.data?.message || "An error occurred while fetching messages.2" };
    }
}
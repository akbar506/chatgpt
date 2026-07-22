import axios from "@/config/axiosConfig"

export const getMessages = async (conversationId) => {
    try {
        const response = await axios.get(`/message/${conversationId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "An error occurred while fetching messages");
    }
}
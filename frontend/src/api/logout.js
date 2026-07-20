import axios from "axios";

export const logout = async () => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
            {},
            {
                withCredentials: true, // Ensure cookies are sent with the request
            }
        )
        return response;
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
}
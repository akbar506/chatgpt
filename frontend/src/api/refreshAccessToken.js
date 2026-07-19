import axios from "axios";

export const refreshAccessToken = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh`
            , {
                withCredentials: true, // Ensure cookies are sent with the request
            }
        )
        return response.data.accessToken;
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw error;
    }
}
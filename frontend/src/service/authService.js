import axios from "axios";

export const refreshAcessToken = async () => {
    try {
        const response = await axios.get   
    } catch (error) {
        console.error("Error refreshing access token:", error);
        throw error;
    }
}
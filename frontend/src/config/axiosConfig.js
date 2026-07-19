import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL + "/api",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,

})

export default axiosInstance;
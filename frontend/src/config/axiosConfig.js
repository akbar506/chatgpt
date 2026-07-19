import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BACKEND_URL + "/api",
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true,

})

export default axiosInstance;

axiosInstance.interceptors.request.use((config) => {
    const token = useSelector((state) => state.user.token);
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
});
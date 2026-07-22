import axios from "@/config/axiosConfig";
import { loadUser } from "@/store/user/userSlice";
import { setAccessToken, setAuthError, resetAuthError } from "@/store/auth/authSlice";

export const registerUser = (userData) => async (dispatch, getState) => {
    try {
        dispatch(resetAuthError());
        const response = await axios.post("/auth/register", userData, { withCredentials: true });
        const { message, accessToken, user } = response.data;
        dispatch(setAccessToken(accessToken));
        dispatch(loadUser(user));
        return { message, success: true };
    } catch (error) {
        dispatch(setAuthError(error.response?.data?.message || "Registration failed"));
        return;
    }
}

export const loginUser = (userData) => async (dispatch, getState) => {
    try {
        dispatch(resetAuthError());
        const response = await axios.post("/auth/login", userData, { withCredentials: true });
        const { message, accessToken, user } = response.data;
        dispatch(setAccessToken(accessToken));
        dispatch(loadUser(user));
        return { message, success: true };
    } catch (error) {
        dispatch(setAuthError(error.response?.data?.message || "Login failed"));
        return;
    }
}
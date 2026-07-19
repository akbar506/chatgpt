import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    accessToken: null,
    isAuthenticated: false,
    error: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
            state.isAuthenticated = true
        },
        clearAccessToken: (state) => {
            state.accessToken = null
            state.isAuthenticated = false
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload
        },
        setAuthError: (state, action) => {
            state.error = action.payload
        },
        resetAuthError: (state) => {
            state.error = null
        },
    }
});

export const { setAccessToken, clearAccessToken, updateAccessToken, setAuthError, resetAuthError } = authSlice.actions

export default authSlice.reducer
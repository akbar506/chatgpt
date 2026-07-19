import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    profile: null,
    error: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loadUser: (state, action) => {
            state.profile = action.payload
        },
        removeUser: (state) => {
            state.profile = null
        },
        setUserError: (state, action) => {
            state.error = action.payload
        },
        resetUserError: (state) => {
            state.error = null
        }
    },
})

export const { loadUser, removeUser, setUserError, resetUserError } = userSlice.actions

export default userSlice.reducer
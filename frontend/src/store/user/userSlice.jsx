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
        setError: (state, action) => {
            state.error = action.payload
        }
    },
})

export const { loadUser, removeUser, setError } = userSlice.actions

export default userSlice.reducer
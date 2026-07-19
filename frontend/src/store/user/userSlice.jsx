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
        updateUser: (state, action) => {
            state.profile = { ...state.profile, ...action.payload } // Merge the existing profile with the updated data
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    },
})

export const { loadUser } = userSlice.actions

export default userSlice.reducer
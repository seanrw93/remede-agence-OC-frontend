import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    payload: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => setUser(action.payload),
        clearUser: () => initialState
    }
})

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
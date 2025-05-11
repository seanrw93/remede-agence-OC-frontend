import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    payload: null,
    loading: false,
    error: null
};

export const updateUserName = createAsyncThunk(
    "user/updateName",
    async(credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/user/profile", credentials);
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.payload = action.payload;
        },
        clearUser: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUserName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserName.fulfilled, (state, action) => {
                state.loading = false;
                state.payload = {
                    ...state.payload,
                    ...action.payload, 
                };
            })
            .addCase(updateUserName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update user name"
            })
    }
})

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
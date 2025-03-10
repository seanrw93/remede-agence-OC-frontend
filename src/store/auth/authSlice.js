import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; 

const initialState = {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null
}

export const signupUser = createAsyncThunk(
    "auth/signup",
    async(credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3001/api/v1/user/signup", credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async(credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:3001/api/v1/user/login", credentials);
            console.log("Login response:", response.data);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null,
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {

        //Handle login
        builder 
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.body.token;
                state.loading = false;
                state.error = null;
                localStorage.setItem("token", action.payload.body.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "An unknown error occurred";
            })
        
        //Handle signup
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.token = action.payload.body.token;
                state.loading = false;
                state.error = null;
                localStorage.setItem("token", action.payload.body.token);
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message || "An unknown error occurred";
            })
    }
});

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null
}

export const signupUser = createAsyncThunk(
    "auth/signup",
    async(credentials, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/signup", credentials);
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
            const response = await axiosInstance.post("/user/login", credentials);
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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        logout: (state) => {
            state.token = null,
            state.loading = false,
            state.error = null;
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

export const { logout, setLoading, setError } = authSlice.actions;

export const authReducer = authSlice.reducer;
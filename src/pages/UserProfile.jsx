import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/user/userSlice"
import { setLoading, setError } from "../store/auth/authSlice"
import axiosInstance from '../utils/axiosInstance';

export const UserProfile = () => {

    const user = useSelector((state) => state.user);
    const { loading, error } = useSelector((state) => state.auth)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async() => {
            const token = localStorage.getItem("token");
            console.log(token);
            if (!token) {
                dispatch(setError("You are not logged in"))
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
                return;
            }

            dispatch(setLoading(true));
            
            try {
                const response = await axiosInstance.post("user/profile", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                
                dispatch(setUser(response.data.body));

            } catch (error) {
                dispatch(setError(error?.response?.data?.message || "An unknown error has occurred"))
                localStorage.removeItem("token");
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchUserData();
    }, [navigate, dispatch]);

    console.log(user);

    const firstName = user?.payload?.firstName;

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <h1>Hello {firstName}</h1>
                    <div>
                        {error ? (
                            <div className="error-message">{error}</div>
                        ) : (
                            <pre>{JSON.stringify(user.payload, null, 2)}</pre>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

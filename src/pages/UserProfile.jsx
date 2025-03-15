import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/user/userSlice"
import { logout } from "../store/auth/authSlice"
import axiosInstance from '../utils/axiosInstance';

export const UserProfile = () => {
    const {id} = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearUser());
        dispatch(logout()); 
        setLoading(true);
        setTimeout(() => navigate("/auth"), 2000);
    }

    useEffect(() => {
        const fetchUserData = async() => {
            setLoading(true);
            const token = localStorage.getItem("token");
            console.log(token);
            if (!token) {
                setError("You are not logged in");
                setLoading(false);
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
                return;
            }

            try {
                const response = await axiosInstance.post("user/profile", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`

                    }
                });
    
                if (!response.ok) {
                    console.table("Error: ", response);
                    localStorage.removeItem("token");
                }
                
                dispatch(setUser(response.data.body));

            } catch (error) {
                setError(error.response?.data?.message);
                localStorage.removeItem("token");
                setTimeout(() => {
                    navigate("/auth");
                }, 2000);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [id, navigate]);

    console.log(user);

    const { firstName, lastName } = user.payload;

    return (
        <>
            {!loading ? (
                <>
                    <h1>Hello {firstName} {lastName}</h1>
                    <div>
                        { loading && <div>Loading...</div> }
                        { JSON.stringify(user.payload.firstName, null, 2) || {error} }
                    </div>
                    <button onClick={handleLogout}>Logout</button>
                </>
                ) : <div>Loading...</div>
            }
        </>
    )
}
